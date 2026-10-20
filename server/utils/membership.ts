/**
 * Who may become a Member, and with what role — as pure rules.
 *
 * The Member tier (ADR-0006) only means "someone deliberately let in" if
 * registering requires an invitation: while every sign-in path auto-creates a
 * user, it means "anyone who can receive an email", a formality rather than a
 * trust boundary. ADR-0007 records when the template closes it.
 *
 * The rules live here, apart from `server/auth.ts`, so they can be exercised
 * without driving real magic-link or SMS delivery.
 *
 * Enforcement is two calls. Admission is one call in the `user.create.before`
 * database hook, because every sign-in path (magic link, email OTP, GitHub
 * OAuth, phone) converges on user creation. Continued membership is one call in
 * the `session.create.before` hook, because every sign-in converges on a
 * session: an invitation withdrawn from the lists withdraws the access it
 * granted, on that person's next sign-in. The row is kept, so re-listing the
 * address is the whole undo.
 *
 * Two modes, chosen by configuration:
 *
 * - **Closed** — `MEMBER_EMAILS` or `ADMIN_EMAILS` has any entry. Invitation
 *   only, and fail-closed: an address on neither list cannot join or sign in,
 *   including one admitted before the lists were set.
 * - **Open** — both are unset or empty. Anyone with a proven address may join,
 *   so a fresh clone works out of the box. `server/auth.ts` says so at boot.
 *
 * This differs from the app it was ported from, which signs in nobody when both
 * lists are empty. A template is cloned and run before anyone has configured it;
 * refusing every sign-in there reads as a broken template, not a secure one.
 */

/** The two env-var lists, parsed. */
export interface MembershipPolicy {
  /** Addresses invited to the Member tier — `MEMBER_EMAILS`. */
  invited: string[]
  /** Addresses that own the app — `ADMIN_EMAILS`. Admitted as Owner. */
  owners: string[]
}

/**
 * What a refused address is told, and the code the refusal carries. One pair for
 * every sign-in path: the refusal is a decision about who may join, not a fault
 * the caller can correct by retrying, so it says what happened and who can
 * change it.
 */
export const MEMBERSHIP_REFUSED_MESSAGE
  = 'Membership is by invitation. Ask the owner to add your address.'
export const MEMBERSHIP_REFUSED_CODE = 'MEMBERSHIP_BY_INVITATION_ONLY'

/**
 * What someone is told when the address is not yet theirs to redeem. Separate
 * from the refusal above because the remedy is different and the person is not
 * being turned away: they are being sent to a path that proves the address.
 */
export const MEMBERSHIP_UNVERIFIED_MESSAGE
  = 'That address is not verified. Sign in with the emailed link instead.'
export const MEMBERSHIP_UNVERIFIED_CODE = 'MEMBERSHIP_ADDRESS_NOT_VERIFIED'

/**
 * What the Owner is told when they try to admit someone through the admin
 * plugin's create-user route. That route is not how Kickstart admits people:
 * membership is granted by listing an address in `MEMBER_EMAILS`, and the
 * person then signs in through a path that proves the address. An admin-created
 * row would have proven nothing, and the natural fix — passing
 * `emailVerified: true` from the client — would quietly make a vouched-for
 * address count as a proven one.
 */
export const MEMBERSHIP_ADMIN_CREATE_MESSAGE
  = 'Membership is granted by listing the address in MEMBER_EMAILS; this route does not admit anyone.'
export const MEMBERSHIP_ADMIN_CREATE_CODE = 'MEMBERSHIP_ADMIN_CREATE_CLOSED'

/**
 * What a formerly admitted address is told when it signs in after being left
 * off the lists. Its own words: this person was let in once and is not a
 * stranger, and the remedy is being re-listed, not an emailed link.
 */
export const MEMBERSHIP_REVOKED_MESSAGE
  = 'Your membership has ended. Ask the owner to add your address again.'
export const MEMBERSHIP_REVOKED_CODE = 'MEMBERSHIP_REVOKED'

/** The admin plugin's create-user endpoint, as Better Auth names it. */
export const ADMIN_CREATE_USER_PATH = '/admin/create-user'

/**
 * Did this user creation come from the admin create-user route?
 *
 * Database hooks receive the endpoint context of the request that reached
 * them; the path is the one thing that tells the admin route apart from the
 * sign-in paths, which all create users through the same adapter call.
 */
export function isAdminCreateRequest(context: { path?: unknown } | null | undefined): boolean {
  return context?.path === ADMIN_CREATE_USER_PATH
}

/**
 * One address in the form the allowlists are stored in.
 *
 * Anything that is not a usable string normalizes to `''`, which is on no list:
 * phone sign-in reaches user creation without an email, and a path that cannot
 * be matched against an allowlist must not be a way in.
 */
function normalizeAddress(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

/** Is this address on one of the policy's lists? */
function isListed(email: unknown, list: string[]): boolean {
  const address = normalizeAddress(email)

  return address !== '' && list.includes(address)
}

/** Normalize one comma-separated env var into a list of comparable addresses. */
export function parseEmailList(raw: string | undefined | null): string[] {
  return (raw || '')
    .split(',')
    .map(normalizeAddress)
    .filter(Boolean)
}

/** Read the policy out of the environment. */
export function membershipPolicyFromEnv(
  env: Record<string, string | undefined>,
): MembershipPolicy {
  return {
    invited: parseEmailList(env.MEMBER_EMAILS),
    owners: parseEmailList(env.ADMIN_EMAILS),
  }
}

/**
 * Is membership open — neither list configured at all?
 *
 * Counts entries, not usable addresses, on purpose. A variable somebody set is
 * a decision to close membership even when it is malformed, and a typo must
 * not reopen the deployment to everyone. That case is closed and admits nobody
 * (`admitsNobody`), which `server/auth.ts` warns about separately.
 */
export function isOpenMembership(policy: MembershipPolicy): boolean {
  return policy.invited.length === 0 && policy.owners.length === 0
}

/**
 * May this address be admitted as a new user?
 *
 * In open mode, yes. Otherwise only if listed; the Owner's own list counts as
 * an invitation, so `ADMIN_EMAILS` does not have to be repeated in
 * `MEMBER_EMAILS`.
 *
 * Proof of address is a separate question (`hasProvenAddress`), asked after
 * this one in both modes.
 */
export function mayJoin(email: unknown, policy: MembershipPolicy): boolean {
  if (isOpenMembership(policy))
    return true

  return isListed(email, policy.invited) || isListed(email, policy.owners)
}

/**
 * May this existing user still sign in?
 *
 * The same question as `mayJoin`, asked of an account rather than an applicant:
 * once membership is closed, it is the lists, and an address they no longer
 * name has no standing whatever it once had — including an account created
 * while membership was open. Named separately so the two call sites read as the
 * two decisions they are, and so one can change without the other.
 */
export function mayRemain(email: unknown, policy: MembershipPolicy): boolean {
  return mayJoin(email, policy)
}

/**
 * The shape an entry has to have to be capable of matching an address.
 *
 * Deliberately about form, not validity: it is not this file's business to rule
 * on what mail servers accept, only to notice an entry that no address Better
 * Auth ever normalizes can equal. Entries reach here already trimmed and
 * lowercased. The local part allows the RFC's unquoted characters — apostrophes
 * and `+` tags included — while a quote, an angle bracket, a space or a second
 * `@` means the variable carries something other than one address.
 */
const ADDRESS_SHAPE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/

/**
 * Which configured entries can never match anybody?
 *
 * `parseEmailList` splits on commas and drops the blanks, so a variable set with
 * any other separator — `;`, a space, a newline — survives as one long entry,
 * and quotes left behind by a shell or a dashboard field survive attached to the
 * address. Every such entry is silently inert.
 *
 * Reported rather than repaired. Guessing at the intended separator would mean
 * inferring an invitation nobody clearly wrote.
 */
export function unusableEntries(list: string[]): string[] {
  return list.filter(entry => !ADDRESS_SHAPE.test(entry))
}

/** How many addresses in a policy are actually capable of admitting someone. */
function usableCount(policy: MembershipPolicy): number {
  const entries = [...policy.invited, ...policy.owners]

  return entries.length - unusableEntries(entries).length
}

/**
 * Is membership closed, yet no configured entry can admit anybody?
 *
 * Asked so the caller can say it out loud at startup. The state is otherwise
 * invisible: the deployment boots, renders the sign-in page, and sends a magic
 * link that is delivered — then refuses at the last step. Open mode is not this
 * state; it admits everyone, and is warned about in its own words.
 */
export function admitsNobody(policy: MembershipPolicy): boolean {
  return !isOpenMembership(policy) && usableCount(policy) === 0
}

/**
 * Has the address been proven to belong to whoever is signing in?
 *
 * An invitation names an address, so only someone who controls that address may
 * redeem it. The email paths prove control inherently — a magic link or an OTP
 * has to be received — and Better Auth records the proof by creating the user
 * with `emailVerified: true`. OAuth proves nothing: `handleOAuthUserInfo` creates
 * the user with whatever the provider reports. So an address sitting unverified
 * on someone else's GitHub account would otherwise be enough to redeem an
 * invitation meant for its owner.
 *
 * Asked in open mode too. There is no invitation to steal there, but there is
 * an address to squat: an account created under an unproven address would pass
 * `mayRemain` the day the real owner of that address is listed.
 *
 * Anything other than a literal `true` is unproven, which keeps a path that
 * omits the field (or invents its own truthy value) closed rather than open.
 */
export function hasProvenAddress(user: { emailVerified?: unknown }): boolean {
  return user.emailVerified === true
}

/**
 * How a refused address is named in the log.
 *
 * Whoever is refused is not a user and never becomes one, so the deployment
 * holds their address on behalf of nobody. And the line is provokable by
 * anyone: request a magic link for any address, follow it, and the refusal
 * writes that address down.
 *
 * The domain is kept, because the refusal needs to stay diagnosable: an
 * invitation written against the wrong domain entirely reads as an ordinary
 * stranger otherwise. The half that identifies a person is the half that goes.
 */
export function describeRefusedAddress(email: unknown): string {
  const address = normalizeAddress(email)

  if (address === '')
    return 'no address'

  const domain = address.slice(address.lastIndexOf('@') + 1)

  return address.includes('@') && domain !== '' ? `an address at ${domain}` : 'an address with no domain'
}

/**
 * Is this the Owner? `ADMIN_EMAILS` is the single list granting the `admin`
 * role, both when a user is created and when the role is re-synced on later
 * logins — so both ask here rather than matching the list themselves.
 */
export function isOwner(email: unknown, policy: MembershipPolicy): boolean {
  return isListed(email, policy.owners)
}

/**
 * The role a newly admitted user is created with: `ADMIN_EMAILS` means Owner,
 * everyone else is a `viewer`. Closing membership is what makes `viewer` mean
 * Member; no new role was needed.
 */
export function roleForNewMember(email: unknown, policy: MembershipPolicy): 'admin' | 'viewer' {
  return isOwner(email, policy) ? 'admin' : 'viewer'
}

/**
 * The role a login should write, or `undefined` to leave the stored one alone.
 *
 * `ADMIN_EMAILS` is the only mechanism the app documents for granting Owner, so
 * it is the one an operator edits to revoke it — which is why the sync runs in
 * both directions. Promoting only would leave an address dropped from the
 * variable an `admin` on every later login, indefinitely.
 *
 * Deliberately narrow in two ways:
 *
 * - Only `admin` is demoted. This list is the source of truth for that role and
 *   no other, so writing `viewer` over every non-Owner would clobber `editor`.
 * - Nothing is written when the stored role already agrees, so an ordinary login
 *   updates its tracking columns and no more.
 *
 * A policy naming no owner demotes rather than abstains — in open mode too: a
 * deployment that configures no Owner has none. The sync is symmetric, so
 * restoring the variable promotes them again on their next login.
 */
export function roleOnLogin(
  email: unknown,
  storedRole: string | undefined,
  policy: MembershipPolicy,
): 'admin' | 'viewer' | undefined {
  const storedAdmin = storedRole === 'admin'

  if (isOwner(email, policy))
    return storedAdmin ? undefined : 'admin'

  // Only a stored `admin` is revoked; any other role is not this list's to write.
  return storedAdmin ? 'viewer' : undefined
}

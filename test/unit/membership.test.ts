import type { MembershipPolicy } from '../../server/utils/membership'
import { describe, expect, it } from 'vitest'
import {
  admitsNobody,
  describeRefusedAddress,
  hasProvenAddress,
  isOpenMembership,
  isOwner,
  mayJoin,
  mayRemain,
  membershipPolicyFromEnv,
  parseEmailList,
  roleForNewMember,
  roleOnLogin,
  unusableEntries,
} from '../../server/utils/membership'

const policy: MembershipPolicy = {
  invited: ['member@kickstart.test'],
  owners: ['owner@kickstart.test'],
}

describe('parseEmailList', () => {
  it('splits, trims and lowercases a comma-separated list', () => {
    expect(parseEmailList(' Member@Kickstart.test , owner@kickstart.test ')).toEqual([
      'member@kickstart.test',
      'owner@kickstart.test',
    ])
  })

  it('drops empty entries left by trailing or doubled commas', () => {
    expect(parseEmailList('a@kickstart.test,,b@kickstart.test,')).toEqual([
      'a@kickstart.test',
      'b@kickstart.test',
    ])
  })

  it('is empty for an unset or blank variable', () => {
    expect(parseEmailList(undefined)).toEqual([])
    expect(parseEmailList('')).toEqual([])
    expect(parseEmailList('   ,  ')).toEqual([])
  })
})

describe('mayJoin', () => {
  it('admits an invited address', () => {
    expect(mayJoin('member@kickstart.test', policy)).toBe(true)
  })

  it('admits the Owner without a second listing', () => {
    // ADMIN_EMAILS is itself an invitation — listing the Owner twice to let
    // them sign in on a new machine is a trap worth not setting.
    expect(mayJoin('owner@kickstart.test', policy)).toBe(true)
  })

  it('refuses an address on neither list', () => {
    expect(mayJoin('stranger@example.com', policy)).toBe(false)
  })

  it('matches case-insensitively and ignores surrounding whitespace', () => {
    expect(mayJoin('  Member@KICKSTART.TEST ', policy)).toBe(true)
  })

  it('admits anyone when neither list is configured (open mode)', () => {
    // The owner decision for the template: a fresh clone must be able to sign
    // in before anyone has configured it. Deliberately unlike the app this was
    // ported from, which admits nobody here (ADR-0007).
    const open = { invited: [], owners: [] }
    expect(mayJoin('member@kickstart.test', open)).toBe(true)
    expect(mayJoin('stranger@example.com', open)).toBe(true)
  })

  it('stays closed when a list is set but every entry is malformed', () => {
    // A typo must not reopen the deployment to everyone. Setting the variable
    // is the decision to close membership, whatever it contains.
    expect(mayJoin('stranger@example.com', { invited: ['a@b.test;c@d.test'], owners: [] })).toBe(false)
  })

  it('refuses a missing or non-string address', () => {
    // Phone sign-in has no email. Nothing that reaches user creation without
    // one can be matched against an allowlist, so nothing without one is let in.
    expect(mayJoin(undefined, policy)).toBe(false)
    expect(mayJoin(null, policy)).toBe(false)
    expect(mayJoin('', policy)).toBe(false)
    expect(mayJoin(42, policy)).toBe(false)
  })
})

describe('isOpenMembership', () => {
  it('is open only when both lists are empty', () => {
    expect(isOpenMembership({ invited: [], owners: [] })).toBe(true)
    expect(isOpenMembership({ invited: ['member@kickstart.test'], owners: [] })).toBe(false)
    expect(isOpenMembership({ invited: [], owners: ['owner@kickstart.test'] })).toBe(false)
  })

  it('counts a malformed entry as configuration, so it stays closed', () => {
    expect(isOpenMembership({ invited: ['"member@kickstart.test"'], owners: [] })).toBe(false)
  })
})

describe('mayRemain', () => {
  it('keeps everyone in open mode', () => {
    expect(mayRemain('anyone@example.com', { invited: [], owners: [] })).toBe(true)
  })

  it('drops an address the closed lists do not name', () => {
    // The transition: an account created while membership was open has no
    // standing once the lists exist and leave it out.
    expect(mayRemain('opened-era@example.com', policy)).toBe(false)
    expect(mayRemain('member@kickstart.test', policy)).toBe(true)
  })
})

describe('unusableEntries', () => {
  it('says nothing about addresses that can match', () => {
    // Entries arrive already trimmed and lowercased by `parseEmailList`, so the
    // shape asked for here is the shape a real address is stored in.
    expect(unusableEntries([
      'member@kickstart.test',
      'first.last+tag@sub.example.co.uk',
      'o\'brien@example.com',
    ])).toEqual([])
  })

  it('flags a list joined by anything other than a comma', () => {
    // The likeliest way to get this wrong. Every one of these is a variable
    // somebody set on purpose, and every one of them matches no address at all.
    expect(unusableEntries(['member@kickstart.test;owner@kickstart.test'])).toEqual([
      'member@kickstart.test;owner@kickstart.test',
    ])
    expect(unusableEntries(['member@kickstart.test owner@kickstart.test'])).toEqual([
      'member@kickstart.test owner@kickstart.test',
    ])
  })

  it('flags quotes the shell or the dashboard left behind', () => {
    expect(unusableEntries(['"member@kickstart.test"'])).toEqual(['"member@kickstart.test"'])
    expect(unusableEntries(['<member@kickstart.test>'])).toEqual(['<member@kickstart.test>'])
  })

  it('flags anything that is not an address at all', () => {
    expect(unusableEntries(['member', 'kickstart.test', 'member@', '@kickstart.test'])).toEqual([
      'member',
      'kickstart.test',
      'member@',
      '@kickstart.test',
    ])
  })

  it('reports only the broken entries, keeping the working ones out of it', () => {
    // A partly-broken list is the worst case: it admits somebody, so nothing
    // else is suspicious, and one invited person silently cannot get in.
    expect(unusableEntries(['member@kickstart.test', '"second@kickstart.test"'])).toEqual([
      '"second@kickstart.test"',
    ])
  })
})

describe('admitsNobody', () => {
  it('is false when neither list is configured, because that is open mode', () => {
    // Open mode admits everyone; it is warned about in its own words.
    expect(admitsNobody({ invited: [], owners: [] })).toBe(false)
  })

  it('is false when either list has an address', () => {
    expect(admitsNobody({ invited: ['member@kickstart.test'], owners: [] })).toBe(false)
    expect(admitsNobody({ invited: [], owners: ['owner@kickstart.test'] })).toBe(false)
    expect(admitsNobody(policy)).toBe(false)
  })

  it('is true when every configured entry is one nothing can match', () => {
    // Set-but-malformed is closed to everyone exactly as unset is, so it has to
    // answer the same. Counting entries rather than usable addresses made this
    // false — the state was real, and the one signal that names it stayed quiet.
    expect(admitsNobody({ invited: ['member@kickstart.test;owner@kickstart.test'], owners: [] })).toBe(true)
    expect(admitsNobody({ invited: [], owners: ['"owner@kickstart.test"'] })).toBe(true)
  })

  it('is false while one usable address survives a broken list', () => {
    // Someone can still get in, so this is not the admits-nobody state; the
    // per-entry warning is what covers the address that cannot.
    expect(admitsNobody({ invited: ['member@kickstart.test', 'bad;entry'], owners: [] })).toBe(false)
  })
})

describe('hasProvenAddress', () => {
  it('accepts an address the sign-in path verified', () => {
    // The email paths create the user with `emailVerified: true` because the
    // link or the code had to be received first.
    expect(hasProvenAddress({ emailVerified: true })).toBe(true)
  })

  it('refuses an address the provider merely asserts', () => {
    // OAuth passes on whatever the provider says, and an address can sit
    // unverified on a GitHub account belonging to someone else entirely.
    expect(hasProvenAddress({ emailVerified: false })).toBe(false)
  })

  it('refuses a missing flag, and anything merely truthy', () => {
    // Fail closed on a shape nobody promised: a path that omits the field, or
    // stores it as a SQLite 1, has not shown the address was proven.
    expect(hasProvenAddress({})).toBe(false)
    expect(hasProvenAddress({ emailVerified: undefined })).toBe(false)
    expect(hasProvenAddress({ emailVerified: 1 })).toBe(false)
    expect(hasProvenAddress({ emailVerified: 'true' })).toBe(false)
  })
})

describe('describeRefusedAddress', () => {
  it('keeps the domain and drops the person', () => {
    expect(describeRefusedAddress('Stranger@Example.com')).toBe('an address at example.com')
  })

  it('says so when the sign-in carried no address at all', () => {
    // The phone path reaches user creation with no email. It is refused like
    // everyone else, and there is nothing to name.
    expect(describeRefusedAddress(undefined)).toBe('no address')
    expect(describeRefusedAddress('')).toBe('no address')
    expect(describeRefusedAddress(null)).toBe('no address')
  })

  it('never falls back to printing the value when it cannot find a domain', () => {
    // The failure mode worth pinning: something that is not an address must not
    // be echoed on the grounds that it looked harmless. Whatever arrived here
    // came from outside and is not this function's to vouch for.
    expect(describeRefusedAddress('bogus')).toBe('an address with no domain')
    expect(describeRefusedAddress('trailing@')).toBe('an address with no domain')
    expect(describeRefusedAddress(42)).toBe('no address')
  })
})

describe('isOwner', () => {
  it('recognizes an address in ADMIN_EMAILS, whatever its case', () => {
    expect(isOwner('owner@kickstart.test', policy)).toBe(true)
    expect(isOwner(' Owner@KICKSTART.TEST ', policy)).toBe(true)
  })

  it('does not treat an invited Member as the Owner', () => {
    // The role sync on every login reads this too: an invited address must not
    // be promoted to admin just for being allowed in.
    expect(isOwner('member@kickstart.test', policy)).toBe(false)
  })

  it('is false for a missing or non-string address', () => {
    expect(isOwner(undefined, policy)).toBe(false)
    expect(isOwner('', policy)).toBe(false)
  })
})

describe('roleForNewMember', () => {
  it('gives the Owner the admin role', () => {
    expect(roleForNewMember('owner@kickstart.test', policy)).toBe('admin')
  })

  it('gives an invited address the viewer role', () => {
    expect(roleForNewMember('member@kickstart.test', policy)).toBe('viewer')
  })

  it('matches the Owner case-insensitively', () => {
    expect(roleForNewMember('Owner@Kickstart.test', policy)).toBe('admin')
  })
})

describe('roleOnLogin', () => {
  it('promotes a stored viewer whose address is now in ADMIN_EMAILS', () => {
    // The direction that already worked: the Owner gets the role even when the
    // row was written before the variable listed them.
    expect(roleOnLogin('owner@kickstart.test', 'viewer', policy)).toBe('admin')
  })

  it('demotes a stored admin whose address is no longer in ADMIN_EMAILS', () => {
    // The direction that silently did nothing, leaving an ex-Owner an admin for
    // good. See `roleOnLogin` for why revocation has to run through this list.
    expect(roleOnLogin('ex-owner@kickstart.test', 'admin', policy)).toBe('viewer')
  })

  it('writes nothing when the stored role already agrees with the list', () => {
    // `undefined` means "leave the stored role alone" — the login still updates
    // its own tracking columns, it just does not restate a role nobody changed.
    expect(roleOnLogin('owner@kickstart.test', 'admin', policy)).toBeUndefined()
    expect(roleOnLogin('member@kickstart.test', 'viewer', policy)).toBeUndefined()
  })

  it('leaves a role that is neither admin nor viewer alone', () => {
    // ADMIN_EMAILS owns exactly the `admin` role, so revoking it means
    // `admin` → `viewer` and nothing else.
    expect(roleOnLogin('member@kickstart.test', 'editor', policy)).toBeUndefined()
  })

  it('demotes an admin when ADMIN_EMAILS names nobody', () => {
    // A deployment that configures no owner has no owners — open mode
    // included. The sync is symmetric, so restoring the variable promotes them
    // again on their next login.
    expect(roleOnLogin('owner@kickstart.test', 'admin', { invited: [], owners: [] })).toBe('viewer')
  })

  it('matches the Owner case-insensitively, in both directions', () => {
    expect(roleOnLogin(' Owner@KICKSTART.TEST ', 'viewer', policy)).toBe('admin')
    expect(roleOnLogin(' Owner@KICKSTART.TEST ', 'admin', policy)).toBeUndefined()
  })

  it('demotes a stored admin carrying no usable address', () => {
    // Nothing that cannot be matched against ADMIN_EMAILS is an Owner — the same
    // reason `mayJoin` refuses a row with no email.
    expect(roleOnLogin(undefined, 'admin', policy)).toBe('viewer')
    expect(roleOnLogin('', 'admin', policy)).toBe('viewer')
  })
})

describe('membershipPolicyFromEnv', () => {
  it('reads the invited list from MEMBER_EMAILS and the owners from ADMIN_EMAILS', () => {
    expect(membershipPolicyFromEnv({
      MEMBER_EMAILS: 'Member@kickstart.test, second@kickstart.test',
      ADMIN_EMAILS: 'Owner@kickstart.test',
    })).toEqual({
      invited: ['member@kickstart.test', 'second@kickstart.test'],
      owners: ['owner@kickstart.test'],
    })
  })

  it('yields empty lists when neither variable is set', () => {
    expect(membershipPolicyFromEnv({})).toEqual({ invited: [], owners: [] })
  })
})

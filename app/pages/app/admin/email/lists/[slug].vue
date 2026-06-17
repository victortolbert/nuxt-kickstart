<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <u-button
        to="/app/admin/email/lists"
        :icon="resolveIcon('arrowLeft')"
        variant="ghost"
        size="sm"
      >
        Back to Lists
      </u-button>
    </div>

    <!-- List Info -->
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">
        {{ emailList.name || emailList.title }}
      </h1>
      <p v-if="emailList.description" class="text-muted">
        {{ emailList.description }}
      </p>
      <div class="flex items-center gap-2 text-sm text-muted">
        <u-icon :name="resolveIcon('users')"></u-icon>
        <span>{{ contacts.length }} {{ contacts.length === 1 ? 'contact' : 'contacts' }}</span>
      </div>
    </div>

    <!-- Add Contact Form -->
    <u-card>
      <template #header>
        <h2 class="font-semibold">
          Add Contact
        </h2>
      </template>

      <form class="space-y-4" @submit.prevent="addContact">
        <div class="grid gap-4 sm:grid-cols-2">
          <u-form-group label="Email" required>
            <u-input
              v-model="newContact.email"
              type="email"
              placeholder="email@example.com"
              :icon="resolveIcon('mail')"
            ></u-input>
          </u-form-group>

          <u-form-group label="Name (optional)">
            <u-input
              v-model="newContact.name"
              type="text"
              placeholder="John Doe"
              :icon="resolveIcon('user')"
            ></u-input>
          </u-form-group>
        </div>

        <u-button
          type="submit"
          :icon="resolveIcon('plus')"
          size="sm"
        >
          Add Contact
        </u-button>
      </form>
    </u-card>

    <!-- Bulk Import -->
    <u-card>
      <template #header>
        <h2 class="font-semibold">
          Bulk Import
        </h2>
      </template>

      <form class="space-y-4" @submit.prevent="bulkImport">
        <u-form-group label="Email addresses" hint="One email per line">
          <u-textarea
            v-model="bulkImportText"
            :rows="6"
            placeholder="alice@example.com&#10;bob@example.com&#10;charlie@example.com"
          ></u-textarea>
        </u-form-group>

        <u-button
          type="submit"
          :icon="resolveIcon('fileImport')"
          size="sm"
        >
          Import Contacts
        </u-button>
      </form>
    </u-card>

    <!-- Contacts Table -->
    <u-card>
      <template #header>
        <h2 class="font-semibold">
          Contacts
        </h2>
      </template>

      <div v-if="contacts.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--ui-border)]">
              <th class="text-left py-3 px-4 text-sm font-semibold">
                Email
              </th>
              <th class="text-left py-3 px-4 text-sm font-semibold">
                Name
              </th>
              <th class="text-right py-3 px-4 text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contact in contacts"
              :key="contact.email"
              class="border-b border-[var(--ui-border)] last:border-0"
            >
              <td class="py-3 px-4 text-sm">
                {{ contact.email }}
              </td>
              <td class="py-3 px-4 text-sm text-muted">
                {{ contact.name || '—' }}
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex justify-end gap-2">
                  <u-button
                    :icon="resolveIcon('trash')"
                    color="error"
                    variant="ghost"
                    size="sm"
                    @click="deleteContact(contact.email)"
                  >
                    Delete
                  </u-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 text-center">
        <u-icon :name="resolveIcon('users')" class="text-4xl text-muted mb-2"></u-icon>
        <p class="text-sm text-muted">
          No contacts yet. Add your first contact above.
        </p>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const route = useRoute()
const { resolveIcon } = useAppearance()
const slug = route.params.slug as string

// Fetch the email list
const { data: list } = await useAsyncData(`email-list-${slug}`, () =>
  queryCollection('emailLists').where('path', '=', slug).first())

if (!list.value) {
  throw createError({ statusCode: 404, message: 'Email list not found' })
}

// Non-null assertion since we throw error above
const emailList = list.value

// Local state for contacts (optimistic UI)
const contacts = ref([...(list.value.contacts || [])])

// Form state for adding new contact
const newContact = ref({
  email: '',
  name: '',
})

// Form state for bulk import
const bulkImportText = ref('')

const toast = useToast()
const confirm = useConfirmDialog()

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

// Add contact handler
function addContact() {
  const email = newContact.value.email.trim()
  const name = newContact.value.name.trim()

  if (!email) {
    toast.add({
      title: 'Email required',
      description: 'Please enter an email address',
      color: 'error',
    })
    return
  }

  if (!emailRegex.test(email)) {
    toast.add({
      title: 'Invalid email',
      description: 'Please enter a valid email address',
      color: 'error',
    })
    return
  }

  // Check for duplicates
  if (contacts.value.some(c => c.email === email)) {
    toast.add({
      title: 'Duplicate email',
      description: 'This email is already in the list',
      color: 'warning',
    })
    return
  }

  // Optimistic UI: add to local state immediately
  contacts.value.push({
    email,
    name: name || undefined,
  })

  // Clear form
  newContact.value.email = ''
  newContact.value.name = ''

  toast.add({
    title: 'Contact added',
    description: `${name || email} has been added to the list`,
    color: 'success',
  })
}

// Bulk import handler
function bulkImport() {
  const text = bulkImportText.value.trim()

  if (!text) {
    toast.add({
      title: 'No emails provided',
      description: 'Please enter at least one email address',
      color: 'error',
    })
    return
  }

  // Parse emails (one per line)
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean)

  const validEmails: string[] = []
  const invalidEmails: string[] = []
  const duplicateEmails: string[] = []

  for (const email of lines) {
    // Check if valid email
    if (!emailRegex.test(email)) {
      invalidEmails.push(email)
      continue
    }

    // Check if already in list
    if (contacts.value.some(c => c.email === email)) {
      duplicateEmails.push(email)
      continue
    }

    // Check if already in valid list (within bulk import)
    if (validEmails.includes(email)) {
      duplicateEmails.push(email)
      continue
    }

    validEmails.push(email)
  }

  // Add valid emails to contacts
  if (validEmails.length > 0) {
    for (const email of validEmails) {
      contacts.value.push({ email })
    }

    toast.add({
      title: 'Contacts imported',
      description: `Added ${validEmails.length} contact${validEmails.length === 1 ? '' : 's'}`,
      color: 'success',
    })

    // Clear textarea
    bulkImportText.value = ''
  }

  // Show warnings for invalid/duplicate emails
  if (invalidEmails.length > 0) {
    toast.add({
      title: 'Invalid emails',
      description: `${invalidEmails.length} email${invalidEmails.length === 1 ? '' : 's'} skipped due to invalid format: ${invalidEmails.slice(0, 3).join(', ')}${invalidEmails.length > 3 ? '...' : ''}`,
      color: 'warning',
    })
  }

  if (duplicateEmails.length > 0) {
    toast.add({
      title: 'Duplicate emails',
      description: `${duplicateEmails.length} email${duplicateEmails.length === 1 ? '' : 's'} already in list`,
      color: 'warning',
    })
  }

  if (validEmails.length === 0 && (invalidEmails.length > 0 || duplicateEmails.length > 0)) {
    toast.add({
      title: 'No contacts imported',
      description: 'All emails were either invalid or already in the list',
      color: 'error',
    })
  }
}

// Delete contact handler
async function deleteContact(email: string) {
  const confirmed = await confirm({
    title: 'Remove contact?',
    description: `This will remove ${email} from this list.`,
    confirmLabel: 'Remove',
    confirmColor: 'error',
    icon: resolveIcon('userMinus'),
  })

  if (!confirmed)
    return

  contacts.value = contacts.value.filter(c => c.email !== email)

  toast.add({
    title: 'Contact removed',
    description: `${email} has been removed from the list`,
    color: 'success',
  })
}
</script>

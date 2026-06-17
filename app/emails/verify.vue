<script setup>
// Verification email. Personalized fields (user, verifyUrl, code) are read from
// `config` and supplied at send time via `render(template, data)`.
const config = defineConfig({
  subject: 'Verify your email',
  preheader: 'Confirm your address to finish signing in.',
})
</script>

<template>
  <Layout>
    <Container class="max-w-xl mt-8">
      <Heading>
        Verify your email
      </Heading>
      <Text>
        Hi {{ config.user || 'there' }}, confirm this address to finish setting up your account.
      </Text>
      <Button :href="config.verifyUrl || 'https://example.com/verify'">
        Verify email
      </Button>
      <Text>
        Prefer a code? Enter <strong>{{ config.code || '000000' }}</strong> — it expires in 10 minutes.
      </Text>
      <Text>
        If you didn't request this, you can safely ignore this email.
      </Text>
    </Container>
  </Layout>
</template>

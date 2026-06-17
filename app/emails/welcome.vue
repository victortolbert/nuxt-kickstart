<script setup>
// `defineConfig` returns the merged config (these defaults + any data passed to
// `render(template, data)` at send time). Read runtime values off `config` —
// bare `{{ user }}` won't resolve, but `{{ config.user }}` will.
const config = defineConfig({
  subject: 'Welcome aboard!',
  preheader: 'Thanks for joining — get set up in a minute.',
})
</script>

<template>
  <Layout>
    <Head>
      <style>
        @import "@maizzle/tailwindcss";

        @theme {
        --color-brand: #f00;
        --font-display: "Inter", sans-serif;
        }
      </style>
    </Head>
    <Body>
      <Container class="max-w-xl mt-8">
        <Heading>
          Hello, {{ config.user || 'there' }}!
        </Heading>
        <Text class="text-brand font-display">
          Welcome aboard! We're glad you're here.
        </Text>
        <Button href="https://example.com">
          Verify email
        </Button>
      </Container>
    </Body>
  </Layout>
</template>

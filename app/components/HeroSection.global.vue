<template>
  <section
    class="relative min-h-125 flex items-center justify-center text-white"
  >
    <div class="container mx-auto px-4 relative z-10 text-center">
      <slot name="title" />
      <slot name="subheadline" />
      <slot name="cta" mdc-unwrap="p" />
    </div>
  </section>
</template>

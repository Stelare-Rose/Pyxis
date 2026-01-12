<script setup lang=ts>
import { Milkdown, useEditor } from '@milkdown/vue'
import { Crepe, type CrepeConfig } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'

const props = defineProps({
  modelValue: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    return emit('update:modelValue', value)
  },
})

// TODO: Refactor this mess.
const editorRef = ref<Crepe | null>(null)
useEditor((root) => {
  const editor = new Crepe({
    root,
    features: { [Crepe.Feature.ImageBlock]: false },
    featureConfigs: {
      [Crepe.Feature.BlockEdit]: {
        handleAddIcon: '',
        handleDragIcon: '',
        blockHandle: {
          shouldShow: () => false,
        },
      },
    },
    defaultValue: props.modelValue || '',
  })
  editorRef.value = editor
  editor.on((api) => {
    api.updated(() => {
      internalValue.value = editor.getMarkdown()
    })
  })
  return editor
})
</script>

<template>
  <Milkdown />
</template>

<style>
.milkdown {
  /* Background Colors */
  --crepe-color-background: var(--foam); /* Main background color */
  --crepe-color-surface: var(--cream); /* Surface color for cards/panels */
  --crepe-color-surface-low: var(--base); /* Lower surface color for depth */

  /* Text Colors */
  --crepe-color-on-background: var(--text); /* Text color on background */
  --crepe-color-on-surface: var(--subtext); /* Text color on surface */
  --crepe-color-on-surface-variant: var(--highlight); /* Secondary text color */

  /* Accent Colors */
  --crepe-color-primary: var(--lilac); /* Primary brand color */
  --crepe-color-secondary: var(--pink); /* Secondary accent color */
  --crepe-color-on-secondary: var(--strawberry); /* Text color on secondary */

  /* UI Colors */
  --crepe-color-outline: var(--lilac); /* Border/outline color */
  --crepe-color-inverse: var(--sky); /* Inverse color for contrast */
  --crepe-color-on-inverse: #F00; /* Text color on inverse */
  --crepe-color-inline-code: var(--pink); /* Inline code color */
  --crepe-color-error: #F00; /* Error state color */

  /* Interactive Colors */
  --crepe-color-hover: var(--foam); /* Hover state color */
  --crepe-color-selected: var(--pink); /* Selected state color */
  --crepe-color-inline-area: var(--cream); /* Inline editing area color */

  --crepe-font-title: "Open Sans", sans-serif;
  --crepe-font-default: "Open Sans", sans-serif;
  --crepe-font-code: 'Monapace Neon', monospace;
  font-weight: 400 !important;
  width: 100%;
}
.milkdown .ProseMirror {
  padding: 8px;
  box-sizing: border-box;
}
.cm-activeLineGutter {
  background-color: var(--pink) !important;
}
.cm-activeLine {
  background-color: #DBB4D340 !important;
}
.cm-line {
  font-family: 'Monaspace Neon', monospace;
  font-size: 11pt;
  color: var(--text);
}
</style>

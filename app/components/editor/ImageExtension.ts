import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageComponent from './ImageComponent.vue'

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: {
        default: null,
        parseHTML: element => element.getAttribute('data-media-id'),
        renderHTML: attributes => {
          if (!attributes.mediaId) {
            return {}
          }
          return {
            'data-media-id': attributes.mediaId,
          }
        },
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageComponent)
  },
})

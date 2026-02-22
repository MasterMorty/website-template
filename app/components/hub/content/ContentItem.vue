<script setup>
// import Status from '../ui/Status.vue';

defineProps({
    content: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['delete']);

const createdDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
};
</script>

<template>
    <div class="h-14 flex justify-between items-center hover:bg-gray-100/10 transition duration-200 cursor-pointer">
        <div class="px-6 basis-1/12">{{ index }}</div>
        <!-- TODO: Make icon versions of the image to use here -->
        <div class="basis-1/12 flex items-center">
            <img v-if="content.image_url" :src="content.image_url" alt=" " class="w-10 h-10 rounded-lg object-cover" />
            <div v-else class="text-sm flex items-center opacity-50">No Image</div>
        </div>
        <div class="px-2 basis-4/12 font-medium text-left truncate">{{ content.title || 'No Title' }}</div>
        <div class="px-2 basis-1/12">{{ content.type }}</div>
        <div class="basis-1/12 text-center">
            <NStatus :status="content.status" />
        </div>
        <div class="basis-3/12 flex justify-end">
            <div class="px-6">{{ createdDate(content.created_at) }}</div>
            <div class="px-6 text-right flex items-center gap-3">
                <UIcon name="i-heroicons-trash" class="w-4 h-4 opacity-30 hover:stroke-red-400 hover:opacity-100 transition duration-100" @click.prevent.stop="emit('delete', content.id)" />
            </div>
        </div>
    </div>
</template>
<template>
    <div class="select-type-container">
        <select @change="changeOption" class="select-input">
        <option value="">Выберите тип данных</option>
        <option
            v-for="option in options">{{ option }}</option>
    </select>
    </div>

</template>

<script>
import { mapActions } from 'vuex';
export default(await import('vue')).defineComponent({
    name: "select-type",
    props: {
        options: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        changeOption(event){
            this.$emit("changeType", event.target.value)
        }
    }

})
</script>

<style>
.select-type-container {
    margin-bottom: 20px;
}

.select-input {
    width: 220px;
    padding: 8px;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 3px;
}
</style>
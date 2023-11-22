<template>
    <div class="input-args-container">
        <div class="section-header">Введите аргумент № {{ id + 1  }}</div>
        <div>
            <select-type 
            @changeType="changeType"
            :options="options"
            >
            </select-type>

            <input 
                v-model = "argument" 
                placeholder = "Введите значение аргумента"
                class="argument-input">
        </div>

    </div>


</template>

<script>
import { mapActions } from 'vuex';
export default(await import('vue')).defineComponent({
    name: "input-args",
    data(){
        return{
            argument: "",
            options: ["string", "uint256"]
        }
    },
    props: {
        id: {
            type: Number
        }
    },
    methods:{
        ...mapActions({

        }),
        changeType(type){
            const types = {id: this.id, type: type}
            this.$emit("changeType", types)
        }
    },
    watch: {
        argument(){
            const arg = {id: this.id, arg: this.argument}
            this.$emit("inputArg", arg)
        }
    }
})
</script>

<style>
.input-args-container {
    max-width: 0 auto;
    margin: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.argument-input {
    width: 400px;
    padding: 8px;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 3px;
}

.section-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
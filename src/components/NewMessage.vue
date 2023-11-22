<template>
    <div class="new-message-container">
        <div class="section-header">Создать новое сообщение на подпись</div>
        <div>
            <input v-model="targetAddress" placeholder="Введите адрес контракта" class="input-field">
            <!-- <p v-if="!isValidAddress" class="error-message">Некорректный адрес</p> -->
        </div>
        <div><input v-model="functionName" placeholder="Введите имя функции" class="input-field"></div>
        <div><input v-model="argsCount" placeholder="Введите количество аргументов" class="input-field"></div>

        <input-args 
            v-for="id in argsId"
            :id="id"
            @changeType="changeType"
            @inputArg="inputArg">
        </input-args>
        <button @click="nMessage" class="button-container">Создать и подписать сообщение</button>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default(await import('vue')).defineComponent({
    name: "new-message", 
    data(){
        return{
            targetAddress: "",
            functionName: "",
            argsCount: "",
            argsId: [],
            arguments: {
                types: [],
                args: []
            }
        }
    },
    // computed: {
    // isValidAddress() {
    //     const addressPattern = /^0x[0-9a-fA-F]{40}$/;
    //     return addressPattern.test(this.targetAddress);
    // }},
    methods:{
        ...mapActions({
            newMessage: "newMessage"
        }),
        changeType(type){

            this.arguments.types[type.id] = type.type
            console.log(this.arguments)
        },
        inputArg(arg){

            this.arguments.args[arg.id] = arg.arg
            console.log(this.arguments)
        },
        async nMessage(){
            await this.newMessage([this.targetAddress, this.functionName, this.arguments])
        }
    },
    watch:{
        argsCount(){
            this.argsId = []
            for (var i = 0; i < this.argsCount; i++){
                this.argsId.push(i)
                console.log(this.argsId[i])
            }
            this.arguments.types =  new Array(this.argsCount)
            this.arguments.args =  new Array(this.argsCount)
        }
    }
})
</script>

<style>
.new-message-container {
    max-width: 0 auto;
    margin: 10px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.input-field {
    width: 400px;
    padding: 8px;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 3px;
}

.button-container {
  margin-top: 20px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
}
</style>
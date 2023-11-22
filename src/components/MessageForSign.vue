<template>

    <div class="new-message-container">
        <div class="section-header">Это форма для подписи сообщения</div>
        <div class="info"><b>Адрес целевого контракта:</b> {{ $store.state.message.targetAddress }}</div>
        <div class="info"><b>Имя функции: </b>{{ $store.state.message.functionName }}</div>
        <div class="info"><b>Аргументы функции: </b>{{ $store.state.message.functionArgs }}</div>
        <div class="info"><b>nonce: </b>{{ $store.state.message.nonce }}</div>
        <div class="info"><b>payload: </b>{{ $store.state.message.payload }}</div>
        <div class="info"><b>message: </b>{{ $store.state.message.message }}</div>
        <div class="info"><b>signers: </b>{{ $store.state.message.signers }}</div>
        <div class="info"><b>signatures: </b>{{ $store.state.message.signatures }}</div>
    </div>

    <button @click="signMessage">Подписать</button>

    <button v-if="$store.state.enoughtSignatures == true" @click="sendMessage">Отправить сообщение</button>
</template>

<script>
import { mapActions } from 'vuex';
export default (await import('vue')).defineComponent({
    name: "message-for-sign",
    methods: {
        ...mapActions({
            sendMessage: "sendMessage",
            signMessage: "signMessage"
        })
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
.info {
  margin-top: 10px;
  font-size: 14px;
  word-break:break-all;
}
</style>
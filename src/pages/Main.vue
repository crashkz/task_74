<template>
    <div class="main">
        <button @click="connectionWallet" class="btn"> Подключить Metamask</button>
        <div class="main-block">
            <div class="section-header">Информация о пользователе: </div>
            <div class="info">Адрес пользователя: {{ $store.state.address }}</div>
            <div class="info">ID цепочки: {{ $store.state.chainId }}</div>
            <div class="info">Пользователь админ: {{ $store.state.admin }}</div>
        </div>

    
    <new-message v-if="$store.state.admin == true && $store.state.newMessage == false"></new-message>
    <message-for-sign v-if="$store.state.admin == true && $store.state.newMessage == true"></message-for-sign>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default (await import('vue')).defineComponent({
    methods: {
        ...mapActions({
            connectionWallet: "connectionWallet"
        })
    }
})

</script>

<style>

.main {
  max-width: 0 auto;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-block {
  max-width: 0 auto;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 10px 15px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #45a049;
}

.info {
  margin-top: 10px;
  font-size: 14px;
}

</style>

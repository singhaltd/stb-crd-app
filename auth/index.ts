import { ref, computed } from "vue";
const state = ref({ accessToken: "" });

function setAccessToken(accessToken: string) {
    const authKey = useCookie("autKey");
    state.value.accessToken = accessToken;
    authKey.value = accessToken
}

const getAccessToken = computed(() => state.value.accessToken);

export { setAccessToken, getAccessToken };
export const signInUser = async (User) => {
    const BaseApi = useRuntimeConfig().public.BASE_URL_API;
    const credentials = $fetch(`${BaseApi}login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: User.value,
    })
    return credentials;
};

export const logoutUser = async () => {
    const userCookie = useCookie("autKey");
    const credentials = $fetch("api/signout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (credentials) {
        userCookie.value = null
        window.location.reload()
    }
}


export const initUser = async () => {
    const userCookie = useCookie("autKey");

    const router = useRouter();

    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //   } else {
    //     //if signed out
    //     router.push("/");
    //   }

    //   firebaseUser.value = user;

    //   // @ts-ignore
    //   userCookie.value = user; //ignore error because nuxt will serialize to json

    //   $fetch("/api/auth", {
    //     method: "POST",
    //     body: { user },
    //   });
    // });
    console.log(userCookie)
};


export const userProfile = (User) => useState<Object>('Profile', () => User)
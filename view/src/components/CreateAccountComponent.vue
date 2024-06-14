<template>
    <div class="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <!-- <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" /> -->
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="createAccount">
                <div>
                    <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
                    <div class="mt-2">
                        <input id="firstName" v-model="firstName" name="name" type="name" autocomplete="given-name"
                            class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input id="email" name="email" type="email" v-model="email" autocomplete="email" required=""
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <!-- <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                        </div> -->
                    </div>
                    <div class="mt-2">
                        <input id="password" v-model="password" name="password" type="password" required=""
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create
                        account</button>
                </div>
            </form>

            <div v-if="errorMessage">
                <p class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
            </div>

            <p class="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                {{ ' ' }}
                <RouterLink :to="{ name: 'log-in' }"
                    class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in</RouterLink>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            firstName: '',
            errorMessage: null,
            navigation: [
                { name: 'Log in', href: '/log-in' },
            ],
        };
    },
    methods: {
        async createAccount() {
            const url = 'http://localhost:3000/api/accounts/create-account';
            const data = {
                firstName: this.firstName,
                email: this.email,
                password: this.password,
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Unknown error occurred');
                }

                const responseData = await response.json();
                console.log('Account created:', responseData);
                this.$router.push('/');

            } catch (error) {
                if (error.message) {
                    this.errorMessage = error.message;
                } else {
                    this.errorMessage = 'An unexpected error occurred';
                }
                console.error('Account creation error:', error);
            }
        },
    },
};
</script>


<style scoped></style>
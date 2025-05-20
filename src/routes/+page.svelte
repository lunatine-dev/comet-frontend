<script>
    import { PUBLIC_API_URL } from "$env/static/public";
    // Replace with actual GitHub login URL or logic
    const loginWithGitHub = () => {
        window.location.href = `${PUBLIC_API_URL}/oauth/github`; // Adjust this to your actual GitHub OAuth route
    };
</script>

<div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4"
>
    <!-- Logo and Title -->
    <div class="flex items-center space-x-3 mb-8">
        <h1
            class="inline-block text-4xl font-bold tracking-tight text-white align-middle"
            style="color: #6165ec;"
        >
            comet
        </h1>
    </div>

    <!-- Info text -->
    <p class="text-base text-gray-400 text-center mb-4">
        To use this app, you must be logged in.
    </p>

    <!-- GitHub Login Button -->
    <button
        class="bg-white text-gray-900 font-semibold py-2 px-3 rounded-md shadow hover:bg-gray-200 transition text-sm cursor-pointer"
        onclick={loginWithGitHub}
    >
        <svg
            class="inline h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.7-1.7-2.5-.3-5.1-1.3-5.1-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.8-.5 2.7-.5.9 0 1.8.2 2.7.5 2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.6 5.5-5.1 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"
            />
        </svg>
        Login with GitHub
    </button>
</div>

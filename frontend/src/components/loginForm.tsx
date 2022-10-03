import { FC } from "react";


const LoginForm: FC = () => {
    // Handles the submit event on form submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevents the default behavior of the form (submitting and refreshing the page)
        event.preventDefault();

        // Get data from the form
        const data = {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value
        };

        const JSONdata = JSON.stringify(data);

        // TODO: Use environment variables
        const endpoint = 'http://localhost:8000/account/login';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSONdata
        };

        const response = await fetch(endpoint, options);

        const result = await response.json();

        // TODO: Remove this, will be replaced with storing the token in the browser's local storage
        alert(`Your token is ${result.access_token}`);

        // TODO:
        // - Redirect to home page if authenticated
        // - Display error message if auth failed
    }

    return (
        <div className="rounded-lg bg-white shadow">
            <div className="px-4 py-8 sm:px-10">
                <div className="text-center text-lg font-semibold">
                    Se connecter
                </div>
                <div className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Mobile number or email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="Adresse e-mail"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="rounded-b-lg border-t-2 border-gray-300 bg-gray-100 px-4 py-6 sm:px-10">
                <p className="text-xs leading-5 text-gray-500">
                    En vous inscrivant, vous acceptez le{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        droit du travail russe
                    </a>
                    , la{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        convention de Genève
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        réforme de l'OCM viti-vinicole
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default LoginForm;

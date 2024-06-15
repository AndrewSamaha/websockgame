import globals from "globals";


export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs"
        },
        rules: {
            "indent": ["error", 4]
        }
    }
];
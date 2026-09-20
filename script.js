/*
===========================================
PUT YOUR GEMINI API KEY HERE
===========================================
*/

const GEMINI_API_KEY = "AQ.Ab8RN6IXLdrnpTXRVXbbKno7Vz-a2GUPuUVsw_l3az2Z7j9cBA";


/*
===========================================
DO NOT CHANGE BELOW THIS LINE
===========================================
*/

const promptBox =
    document.getElementById("prompt");

const generateBtn =
    document.getElementById("generateBtn");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const generatedImage =
    document.getElementById("generatedImage");

const downloadBtn =
    document.getElementById("downloadBtn");

const errorBox =
    document.getElementById("error");


generateBtn.addEventListener(
    "click",
    generateImage
);


/*
Allow Ctrl + Enter / Enter to generate
*/

promptBox.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            generateImage();
        }
    }
);


/*
===========================================
GENERATE IMAGE
===========================================
*/

async function generateImage() {

    const prompt =
        promptBox.value.trim();


    if (!prompt) {

        showError(
            "Please describe the image you want to create."
        );

        return;
    }


    if (
        !GEMINI_API_KEY ||
        GEMINI_API_KEY ===
        "PASTE_YOUR_GEMINI_API_KEY_HERE"
    ) {

        showError(
            "Please add your Gemini API key in script.js first."
        );

        return;
    }


    setLoading(true);


    try {

        /*
        Gemini image generation model
        */

        const url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key="
            + encodeURIComponent(GEMINI_API_KEY);


        const response =
            await fetch(
                url,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [
                            {
                                parts: [
                                    {
                                        text:
                                            prompt
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            responseModalities: [
                                "TEXT",
                                "IMAGE"
                            ]
                        }

                    })
                }
            );


        const data =
            await response.json();


        /*
        Check API errors
        */

        if (!response.ok) {

            const message =
                data?.error?.message ||
                "Gemini API request failed.";

            throw new Error(message);
        }


        /*
        Find the generated image
        */

        const parts =
            data?.candidates?.[0]?.content?.parts;


        if (!parts) {

            throw new Error(
                "No image was returned by Gemini."
            );
        }


        let imagePart = null;


        for (const part of parts) {

            if (
                part.inlineData &&
                part.inlineData.data
            ) {

                imagePart = part.inlineData;

                break;
            }
        }


        if (!imagePart) {

            throw new Error(
                "Gemini did not return an image. Try a different prompt."
            );
        }


        /*
        Convert Base64 → image
        */

        const mimeType =
            imagePart.mimeType ||
            "image/png";


        const imageURL =
            "data:" +
            mimeType +
            ";base64," +
            imagePart.data;


        /*
        Display image
        */

        generatedImage.src =
            imageURL;


        downloadBtn.href =
            imageURL;


        result.classList.remove(
            "hidden"
        );


        errorBox.textContent = "";


    }

    catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Something went wrong while creating the image."
        );

    }

    finally {

        setLoading(false);
    }
}


/*
===========================================
LOADING UI
===========================================
*/

function setLoading(isLoading) {

    if (isLoading) {

        loading.classList.remove(
            "hidden"
        );

        generateBtn.disabled =
            true;

        generateBtn.textContent =
            "Creating Image...";

        result.classList.add(
            "hidden"
        );

        errorBox.textContent = "";

    }

    else {

        loading.classList.add(
            "hidden"
        );

        generateBtn.disabled =
            false;

        generateBtn.textContent =
            "✦ Create Image";
    }
}


/*
===========================================
ERROR MESSAGE
===========================================
*/

function showError(message) {

    errorBox.textContent =
        message;

    result.classList.add(
        "hidden"
    );
}

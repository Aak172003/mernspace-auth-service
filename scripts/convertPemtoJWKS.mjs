import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privateKey = fs.readFileSync("./certs/private.pem");

// This token is only used for signature purposes, not for encryption.

const jwks = rsaPemToJwk(
    privateKey,
    {
        use: "sig",
    }, // Use "sig" for signature, "enc" for encryption
    "public",
);

console.log("this is jwk -------------- ", jwks);
console.log("change format ", JSON.stringify(jwks));

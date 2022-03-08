import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { Plugin } from "@nuxt/types";

type Firebase = {
    app: FirebaseApp,
    firestore: Firestore,
}

declare module '@nuxt/types' {
    interface Context {
        $firebase: Firebase
    }
}

const firebase: Plugin = (context) => {
    const firebaseConfig = {
        apiKey: context.$config.API_KEY,
        authDomain: context.$config.AUTH_DOMAIN,
        projectId: context.$config.PROJECT_ID,
        storageBucket: context.$config.STORAGE_BUCKET,
        messagingSenderId: context.$config.MESSAGING_SENDER_ID,
        appId: context.$config.APP_ID,
        measurementId: context.$config.MEASUREMENT_ID,
    };


    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    if(context.$config.NODE_ENV === 'development') {
        connectFirestoreEmulator(firestore, 'localhost', 8081);
    }

    context.$firebase = {
        app,
        firestore,
    };
};

export default firebase;

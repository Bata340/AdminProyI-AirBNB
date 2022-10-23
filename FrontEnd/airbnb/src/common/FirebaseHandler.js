// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0xLAofWL7X9YmY24ap_XVeA7Pf0cbrNI",
  authDomain: "airbnb-admin-gp5.firebaseapp.com",
  projectId: "airbnb-admin-gp5",
  storageBucket: "airbnb-admin-gp5.appspot.com",
  messagingSenderId: "243487350151",
  appId: "1:243487350151:web:986ae6d90183e5174b8722",
  measurementId: "G-0XFNCKE2ST"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

/*
export const handleUploadFirebaseImage = (name, image) => {
    image.name = name;
    const storageRef = ref(firebaseStorage, `/files/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    const [percentageFinish, setPercentageFinish] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [urlPublished, setUrlPublished] = useState('');

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setPercentageFinish(percent);
        },
        (err) => console.log(err),
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setUrlPublished(url);
                setIsLoading(false);
            });
        }
    ); 

    return { percentageFinish, isLoading, urlPublished };
}
*/
export const getFirebaseImage = async (name) => {
    return await getDownloadURL(ref(firebaseStorage, name));
}
// ตรวจจับกล้อง
const video = document.getElementById('video');

// โหลด face-api.js
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.emotionNet.loadFromUri('/models')
]).then(startVideo);

// ฟังก์ชันเริ่มต้นกล้อง
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => {
            video.srcObject = stream;
        },
        err => console.error(err)
    );
}

// ฟังก์ชันตรวจจับใบหน้าและอารมณ์
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withAgeAndGender()
            .withEmotion();

        canvas.clear();
        canvas.render(detections);

        // แสดงอารมณ์บนหน้าจอ
        detections.forEach(detection => {
            const emotions = detection.emotions;
            let dominantEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
            console.log(`Dominant Emotion: ${dominantEmotion}`);
        });
    }, 100);
});

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const inputElement = document.getElementById("audio")
// console.log(inputElement)

    .addEventListener("change", (Event) => {
        const file = Event.target.files[0];
        // console.log (file);

        const reader = new FileReader();

        reader.addEventListener("load", (Event) => {
            const arrayBuffer = Event.target.result;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                audioContext.decodeAudioData(arrayBuffer, (audiobuffer) => {
                    visualize(audiobuffer, audioContext);
                    
                });
                
        })

        reader.readAsArrayBuffer(file);
       
    });

    function visualize(audiobuffer, audioContext) {
        const canvas = document.getElementById("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = 500;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256
        
        const frequencyBufferLength = analyser.frequencyBinCount
        const frequencyData = new Uint8Array(frequencyBufferLength)

        const source = audioContext.createBufferSource()
        source.buffer = audiobuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination)
        source.start()

        const canvasContext = canvas.getContext("2d");

        canvasContext.fillstyle = "#F4C2C2";
        
        const barWidth = canvas.width / frequencyBufferLength 

        function draw() {
            requestAnimationFrame(draw)
           
            canvasContext.clearRect(0, 0, canvas.width, canvas.height)
             
            analyser.getByteFrequencyData(frequencyData)
    
            for (let i = 0; i < frequencyBufferLength ; i++) {

                /* 0, chunkSize
                chunkSize, chunkSize *2
                const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);
    
                const min = Math.min(...chunk) * 20
                const max = Math.max(...chunk) * 20 */
                                               
                canvasContext.fillRect(
                    i * barWidth, 
                    canvas.height - frequencyData[i], 
                    barWidth - 1, 
                    frequencyData[i]
                )
    
            
            }

        }
        draw()
    }
 
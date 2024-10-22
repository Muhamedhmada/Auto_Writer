import './RichText.css'
import JoditEditor from 'jodit-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone  , faMicrophoneLinesSlash} from '@fortawesome/free-solid-svg-icons';
import React, { useState , useRef , useMemo , useEffect} from 'react';
import { Select  } from 'antd';

function RichText(){
   const editor = useRef(null);
   const [transcript, setTranscript] = useState('');
   const [isListening, setIsListening] = useState(false);
   const recognitionRef = useRef(null);
   const [language , setLagnuage] = useState("ar-SA")
   const [startRec , setStartRec] = useState(false)


  // modules is the propertis that you can add it to text
  const modules = {
    toolbar: [
      // header 
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      // font property
      ['bold', 'italic', 'underline', 'strike'] ,

      // you can upload an image or video or link or function
      ['link', 'image', 'video', 'formula'],

      // quote the question
      ['blockquote', 'code-block'],

      // list text
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],

      // direction of the text
      [{ 'direction': 'rtl' }],

      // color and background of the text if you keep array empty it take oll available colors
      // or you can determine some color that user can't use other color
      [{ 'color': ["red"] }, { 'background': ["red"] }],  // dropdown with defaults from theme

      // position of text
      [{ 'align': [] }],

      // font type
      [{ 'font': [] }],

      // to make a space at first of line
      [{ 'indent': '-1'}, { 'indent': '+1' }],// outdent/indent

      // to clear text formatting
      ['clean'],// remove formatting button
    ]
  }

  // Fixing the useMemo hook
  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Write here...",

  }), []);
 

  // Initialize speech recognition
  useEffect(() => {

    // recognition.lang = 'ar-SA'; // Arabic language for transcription

    // check if your browser support speech recongnition or not
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support SpeechRecognition.");
      return;
    }
    
    // اما يسجل هيحفظ الريكورد هنا علشان بعدها يترجم
    const recognition = new SpeechRecognition();

    // You Can make state and choose language from an input or button
    recognition.lang = language; // Use selected language for transcription

    // علشان المحادثه متقفش غير اما انا اوقفها بالزرار
    // لو خليتها false هيوقف التسجيل مع اول وقف ليك وانت بتتكلم
    recognition.continuous = true;  // Keep recognition going

    // دى بتحول للكلام فى نفس الوقت مش بتستناك اما تخلص كلام وهتستناك اما تخلص كلام وبعدها تكتبه لو خليتها false
    recognition.interimResults = true; // Allow partial results


    // variable that store the final resutl of text
    let finalTranscript = transcript

    // بتشتغل كل اما بييجى نتيجه جديده يعنى كل اما تتكلم هى بتشتغل
    recognition.onresult = (event) => {
      // اللى بيشيل الكلام اللى بتقوله
      let interimTranscript = ''; // Temporary holder for current interim results

      // بيعمل لوب على الكلام اللى بتقوله علشان يخزنه
      for (let i = event.resultIndex; i < event.results.length; i++) {
        console.log(event.results[i])
        const transcriptPart = event.results[i][0].transcript;
  
        if (event.results[i].isFinal) {
          // If the result is final, append it to the final transcript
          finalTranscript += transcriptPart + ' ' ;
          setTranscript(finalTranscript); // Update the transcript state
        } 
        else {
          // If it's an interim result, accumulate it
          interimTranscript += transcriptPart + ' ';
        }
      }
    }  

    // فى حاله عدم تسجيل صوت
    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
      console.log("error")
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        recognition.stop(); // Stop on error
      }
    };

    recognitionRef.current = recognition;

  }, [language , transcript]);


  const startListening = () => {

    setStartRec(true)
    console.log(new window.webkitSpeechRecognition())
    // console.log()

    // CONDITION
    if (recognitionRef.current && !isListening) {

      // START RECORDING
      recognitionRef.current.start(); // Start recognition

      recognitionRef.current.lang = language

      // CHANGING STATE 
      setIsListening(true);
    } else {
      console.log("Speech recognition is already running.");
    }
  };

  const stopListening = () => {
    setStartRec(false)
    // CONDITION
    if (recognitionRef.current && isListening) {
      
      // STOP RECORDING
      recognitionRef.current.stop(); // Stop recognition

      // CHANGE STATE
      setIsListening(false);
    }
  };


  return(
    <>
      <div className='richText-container'>


        {/* there is a libarry called quill but it less greater than jodit */}
        {/* using Jodit */}

        <JoditEditor
          // onChange={(e)=>setRichValue(e)}
          ref={editor}
          value ={transcript}
          config={config}
          tabIndex={1}
          onChange={newContent => setTranscript(newContent)}
          // console.log(newContent)
          
          // onChange={newContent => {}}   xcv
          className="richText"
        />
        <div className='form'>
          <Select
            onChange={(e)=>{setLagnuage(e) ;console.log(language)}}
            showSearch
            placeholder="Select a language"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: 'ar-SA',
                label: 'Arabic',
              },
              {
                value: 'en-US',
                label: 'English',
              },
            ]}
          />
        </div>

        <div className="rec">
          <p>{language==="ar-SA"?"Arabic":"English"}</p>
          {window.SpeechRecognition}
          {startRec?
          <div className="loading-wave">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
          </div>:null}
          <button className='startRec' onClick={startListening} disabled={isListening} style={{display:isListening?"none":null}}><FontAwesomeIcon className='icon' icon={faMicrophoneLinesSlash} /></button>
          <button className='stopRec' onClick={stopListening} disabled={!isListening} style={{display:!isListening?"none":null}}><FontAwesomeIcon className='icon' icon={faMicrophone} /></button>

        </div>

      </div>
    </>
  )
}
export default RichText

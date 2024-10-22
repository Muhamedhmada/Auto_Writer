import Navbar from '../Navbar/Navbar'
import './RichText.css'

// import a react quill library that make a rich text
import React, { useState , useRef , useMemo , useEffect} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// using Jodit
import JoditEditor from 'jodit-react';

  // drag and drop

  import { FileUploader } from "react-drag-drop-files";

function RichText(){

  // drag drop files
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

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

  // using Jodit

  const editor = useRef(null);
	const [content, setContent] = useState('')
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);


  // Fixing the useMemo hook
  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Write here...",

    // drag and drop

    buttons: [
      'bold', 'italic', 'underline', 'strike', 'link', 'image', 'video', 'clean',
      {
        name: "speech",
        iconURL: "path_to_your_icon.svg", // Add a proper icon URL here
        exec: startListening, // Call the startListening function
      },
    ]
  }), []);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.lang = 'en-US'; 

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        interimTranscript += transcriptPart;
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        stopListening(); // Stop on error
      }
    };

    var recognitionRef.current = recognition; // Store the recognition instance
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start(); // Start recognition
      setIsListening(true);
    } else {
      console.log("Speech recognition is already running.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop(); // Stop recognition
      setIsListening(false);
    }
  };

  return(
    <>
      <Navbar />
      <div className='RichText-container'>
        <h1>RichText</h1>
        <ReactQuill 
          theme="snow" 
          modules={
            modules
          }
        />

        {/* using Jodit */}

        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={newContent => setContent(newContent)}
          onChange={newContent => {}}          
          />
        {/* drag and drop */}
        <FileUploader handleChange={(e)=>{
          handleChange()
          console.log(e.name)
          }} name="file" value="ge" types={fileTypes} 
          />

      </div>
    </>
  )
}
export default RichText

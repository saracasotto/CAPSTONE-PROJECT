const Timer = ({ bookId }) => {
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
  
    useEffect(() => {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
  
      return () => clearInterval(timerRef.current);
    }, []);
  
    const stopTimer = () => {
      clearInterval(timerRef.current);
      //QUI INVIO TEMPO AL BACKEND
    };
  
    return (
      <div className="timer">
        <h4>Reading Session: {time}s</h4>
        <button onClick={stopTimer}>Stop</button>
      </div>
    );
  };
  
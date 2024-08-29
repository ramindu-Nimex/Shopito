import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";

export default function NewPrompt() {
    const endRef = useRef();
    const [img, setImg] = useState({
      isLoading: false,
      error: "",
      dbData: {},
    });

    useEffect(() => {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }, [])
  return (
    <>
    {/* ADD NEW CHAT */}
    {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
    <div className="pb-24" ref={endRef} />
      <form className="newForm">
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden/>
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
}

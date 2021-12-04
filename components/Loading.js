import { Circle } from 'better-react-spinkit'

function Loading() {
    return (
        <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <div>
                {/* as we are doing server side rendering thats why we are using inline css instead of style components */}
                <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    alt=""
                    style={{ marginBottom: '10px' }}
                    height={200}
                />

                <Circle color="#3CBC28" size={60} />
            </div>
        </center>
    )
}

export default Loading

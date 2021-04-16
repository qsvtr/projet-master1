import React, {useContext, useEffect} from "react";
import GlobalState from "../../contexts/GlobalState";

export default function Information() {
    const [state, setState] = useContext(GlobalState);
    useEffect(() => {
        setState(state => ({...state}))
    }, []);
    return (
        <div>
            { !state.error
                ? null
                : [
                    (state.error.metamaskNotInstalled
                            ? <p style={{color: "red"}}>you need to install Metamask before</p>
                            : null
                    ),
                    (state.error.wrongChainId
                            ? <p style={{color: "red"}}>please use Avalanche Network Fuji as network</p>
                            : null
                    ),
                    (state.error.notConnected
                            ? <p style={{color: "red"}}>you need to be connected with Metamask first</p>
                            : null
                    ),
                ]
            }
        </div>
    )
}

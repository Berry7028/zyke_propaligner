import { callback, listen, send } from "./utils/nui-events";
import AlignmentInputs from "./AlignmentInputs";
import { useTranslation } from "../context/Translation";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import Modal from "./utils/Modal";
import { useModalContext } from "../context/ModalContext";
import { Bone } from "../types";
import { useEffect, useState } from "react";

export interface Animation {
    label: string;
    dict: string;
    clip: string;
}

const MainMenu = () => {
    const T = useTranslation();
    const { openModal, closeModal, suspendModals, unsuspendModals } =
        useModalContext();

    const [bones, setBones] = useState<Bone[]>([]);
    const [animations, setAnimations] = useState<Animation[]>([]);

    listen("SetOpen", (val: boolean) => {
        if (val) {
            openModal("mainMenu");
        } else {
            closeModal("mainMenu");
        }
    });

    listen("SetSuspension", (val: boolean) => {
        if (val) {
            suspendModals();
        } else {
            unsuspendModals();
        }
    });

    const formatBones = (bones: Bone[]) => {
        return bones.map((item) => ({
            ...item,
            label: item.name + ` (${item.id})`,
            value: item.id.toString(),
        }));
    };

    listen("SetBones", (bones: Bone[]) => setBones(formatBones(bones)));

    useEffect(() => {
        callback("GetBones").then((bones: Bone[]) =>
            setBones(formatBones(bones))
        );

        callback("GetBaseAnimations").then((res) => setAnimations(res));
    }, []);

    useEffect(() => {
        send("MountedUI", null);
    }, []);

    return (
        <>
            <Modal
                id="mainMenu"
                icon={<ControlCameraIcon />}
                title={T("propAlignerTitle")}
                onClose={() => send("CloseMenu", undefined, undefined)}
                closeButton
                modalStyling={{
                    width: "55rem",
                }}
            >
                <AlignmentInputs bones={bones} animations={animations} />
            </Modal>
        </>
    );
};

export default MainMenu;

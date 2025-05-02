import React, { useState } from "react";
import SectionTitle from "../utils/SectionTitle";
import { useTranslation } from "../../context/Translation";
import { AlignmentData, ParticleAlignmentData } from "../../types";
import { Accordion } from "@mantine/core";
import Button from "../utils/Button";
import AddIcon from "@mui/icons-material/Add";
import Particle from "./Particle";

interface ParticleSectionProps {
    setEditingData: React.Dispatch<React.SetStateAction<AlignmentData>>;
    particles: ParticleAlignmentData[] | null;
    propIdx: number;
}

const ParticleSection: React.FC<ParticleSectionProps> = ({
    setEditingData,
    particles,
    propIdx,
}) => {
    const T = useTranslation();
    const [accOpen, setAccOpen] = useState<string | null>(null);

    const addBaseParticle = async () => {
        console.log("Adding base particle alignment");

        setEditingData((prev) => ({
            ...prev,
            props: prev.props.map((prop, idx) => {
                if (idx === propIdx) {
                    return {
                        ...prop,
                        particles: [
                            ...(prop.particles || []),
                            {
                                dict: "",
                                clip: "",
                                offset: { x: 0, y: 0, z: 0 },
                                size: 1,
                            },
                        ],
                    };
                }
                return prop;
            }),
        }));
    };

    return (
        <div>
            <SectionTitle text={T("particleAlignmentSectionTitle")} />

            <Accordion value={accOpen} onChange={setAccOpen}>
                {particles && particles.length > 0
                    ? particles.map((particle, idx) => (
                          <Particle
                              key={`particle-${idx}`}
                              idx={idx}
                              particle={particle}
                              setEditingData={setEditingData}
                              propIdx={propIdx}
                              accOpen={accOpen}
                              setAccOpen={setAccOpen}
                          />
                      ))
                    : null}
            </Accordion>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                }}
            >
                <Button
                    color="rgba(var(--blue2))"
                    icon={<AddIcon />}
                    onClick={async () => await addBaseParticle()}
                    // disabled={hasInvalidModels}
                >
                    {T("addParticle")}
                </Button>
            </div>
        </div>
    );
};

export default ParticleSection;

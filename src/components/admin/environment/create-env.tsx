import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { InputText } from "../../input-text.tsx";

import {
    Grid3x3Rounded,
    AddHomeRounded,
    MeetingRoomRounded,
    WorkspacesRounded,
} from "@mui/icons-material";
import { CreateEnvironment } from "../../../services/environment.service.ts";
import { toast } from "sonner";

interface CreateEnvironmentDialogParamns {
    onSucess: () => {};
}

export function CreateEnvironmentDialog({ onSucess }: CreateEnvironmentDialogParamns) {
    const [newEnv, setNewEnv] = useState({
        name: "",
        abbreviation: "",
        numberOfStations: 0,
    });

    function handleChangeName(newValue: string) {
        setNewEnv((prevEnv) => ({ ...prevEnv, name: newValue }));
    }

    function handleChangeAbbreviation(newValue: string) {
        setNewEnv((prevEnv) => ({ ...prevEnv, abbreviation: newValue }));
    }

    function handleChangeNumberOfStations(newValue: number) {
        setNewEnv((prevEnv) => ({ ...prevEnv, numberOfStations: newValue }));
    }

    const handleSave = async () => {
        try {
            await CreateEnvironment(
                newEnv.name,
                newEnv.abbreviation,
                newEnv.numberOfStations
            );
            handleChangeName("");
            handleChangeAbbreviation("");
            handleChangeNumberOfStations(0);
            toast.success("Ambiente criado com sucesso");
            onSucess();
        } catch (error) {
            console.error(error);
            toast.error(
                "Erro ao criar ambiente. Verifique suas credenciais e tente novamente."
            );
        }
    };

    function handleOpenChange() {
        handleChangeName("");
        handleChangeAbbreviation("");
        handleChangeNumberOfStations(0);
    }


    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger>
                <span className="text-slate-500 bg-slate-200 p-3 flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors rounded-sm">
                    <AddHomeRounded /> Cadastro de ambientes
                </span>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden overflow-y-auto inset-0 md:inset-auto md:right-0 md:top-0 md:max-w-[640px] py-10 px-10 w-full md:h-full bg-white flex flex-col outline-none">
                    <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
                        <X className="size-5 " />
                    </Dialog.Close>

                    <h3 className="text-2xl font-semibold text-slate-500 mb-10">
                        Cadastrar novo ambiente
                    </h3>

                    <form className="flex-1 flex flex-col">
                        <InputText
                            text="Nome"
                            icon={<MeetingRoomRounded />}
                            placeholder="Nome do ambiente"
                            type="text"
                            onChange={(e) => handleChangeName(e.target.value)}
                            value={newEnv.name}
                        />
                        <InputText
                            text="Nome"
                            icon={<Grid3x3Rounded />}
                            placeholder="Sigla do ambiente"
                            type="text"
                            onChange={(e) => handleChangeAbbreviation(e.target.value)}
                            value={newEnv.abbreviation}
                        />
                        <InputText
                            text="Quantidade de estações"
                            icon={<WorkspacesRounded />}
                            placeholder="Quantidade de estações"
                            type="number"
                            onChange={(e) => handleChangeNumberOfStations(parseInt(e.target.value))}
                            value={newEnv.numberOfStations.toString()}
                        />

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => handleSave()}
                                className="bg-blue-900 text-white mt-5 px-6 py-2 w-[70%] rounded-sm hover:bg-blue-950 transition-colors"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root >
    );
}
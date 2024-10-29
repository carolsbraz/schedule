import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { InputText } from "../../input-text.tsx";

import {
    Grid3x3Rounded,
    MeetingRoomRounded,
    WorkspacesRounded,
    EditRounded,
} from "@mui/icons-material";
import { Environment, UpdateEnvParams, updateEnv } from "../../../services/environment.service.ts";
import { toast } from "sonner";

interface EditEnvironmentDialogParamns {
    env: Environment;
    onSucess: () => {};
}

export function EditEnvironmentDialog({ env, onSucess }: EditEnvironmentDialogParamns) {
    const [currentEnv, setCurrentEnv] = useState<Environment>({
        id: env.id,
        name: env.name,
        abbreviation: env.abbreviation,
        numberOfStations: env.numberOfStations,
    });

    function handleChangeName(newValue: string) {
        setCurrentEnv((prevEnv) => ({ ...prevEnv, name: newValue }));
    }

    function handleChangeAbbreviation(newValue: string) {
        setCurrentEnv((prevEnv) => ({ ...prevEnv, abbreviation: newValue }));
    }

    function handleChangeNumberOfStations(newValue: number) {
        setCurrentEnv((prevEnv) => ({ ...prevEnv, numberOfStations: newValue }));
    }

    const handleSave = async () => {
        try {
            const updateParams: UpdateEnvParams = {
                id: currentEnv.id,
                name: currentEnv.name,
                abbreviation: currentEnv.abbreviation,
                numberOfStations: currentEnv.numberOfStations
            };

            await updateEnv(updateParams);
            toast.success("Ambiente atualizado com sucesso");
            onSucess();
        } catch (error) {
            console.log("erro")
            console.error(error);
            toast.error(
                "Erro ao atualizar ambiente. Verifique suas credenciais e tente novamente."
            );
        }
    };

    function handleNumberOfStationsValue() {
        return currentEnv.numberOfStations ? currentEnv.numberOfStations.toString() : "0";
    }

    function handleOpenChange() {
        setCurrentEnv(env);
    }

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger>
                <span className="text-slate-500 bg-transparent p-2 flex items-center justify-center rounded-full hover:bg-slate-100">
                    <EditRounded />
                </span>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden overflow-y-auto inset-0 md:inset-auto md:right-0 md:top-0 md:max-w-[640px] py-10 px-10 w-full md:h-full bg-white flex flex-col outline-none">
                    <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
                        <X className="size-5 " />
                    </Dialog.Close>

                    <h3 className="text-2xl font-semibold text-slate-500 mb-10">
                        Atualização de ambiente
                    </h3>

                    <form className="flex-1 flex flex-col">
                        <InputText
                            text="Nome"
                            icon={<MeetingRoomRounded />}
                            placeholder="Nome do ambiente"
                            type="text"
                            onChange={(e) => handleChangeName(e.target.value)}
                            value={currentEnv.name}
                        />
                        <InputText
                            text="Nome"
                            icon={<Grid3x3Rounded />}
                            placeholder="Sigla do ambiente"
                            type="text"
                            onChange={(e) => handleChangeAbbreviation(e.target.value)}
                            value={currentEnv.abbreviation}
                        />
                        <InputText
                            text="Quantidade de estações"
                            icon={<WorkspacesRounded />}
                            placeholder="Quantidade de estações"
                            type="number"
                            onChange={(e) => handleChangeNumberOfStations(parseInt(e.target.value))}
                            value={handleNumberOfStationsValue()}
                        />

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => handleSave()}
                                className="bg-blue-900 text-white mt-5 px-6 py-2 w-[70%] rounded-sm hover:bg-blue-950 transition-colors"
                            >
                                Atualizar
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root >
    );
}
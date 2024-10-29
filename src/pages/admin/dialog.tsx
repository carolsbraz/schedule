import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { InputText } from "../../components/input-text";

export interface Environment {
  id?: string;
  name?: string;
  abbreviation?: string;
  numberOfStations?: number;
}

interface EditEnvironmentDialogParamns {
  agendamento: any;
  left: number;
  width: number;
}

export function EditEnvironmentDialog({
  agendamento,
  left,
  width,
}: EditEnvironmentDialogParamns) {
  const [currentEnv, setCurrentEnv] = useState({
    id: agendamento.id,
    name: agendamento.name,
    abbreviation: agendamento.abbreviation,
    numberOfStations: agendamento.numberOfStations,
  });

  function handleOpenChange() {
    setCurrentEnv(agendamento);
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <div
          key={agendamento.descricao}
          className="absolute bg-green-500 text-white px-2 py-1 rounded"
          style={{
            left: `${left + 7}px`,
            width: `${width}px`,
            height: "100%",
          }}
        >
          {agendamento.descricao}
        </div>
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
          <p>{agendamento.descricao}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

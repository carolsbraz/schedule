import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { InputText } from "../../input-text.tsx";
import { InputRadio } from "../../input-radio.tsx";
import {
  AlarmAddRounded,
  ChairAltRounded,
  HomeRounded,
  DescriptionRounded,
  CheckRounded,
  ClearRounded,
  CalendarMonthRounded,
  AccessAlarmRounded,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  Environment,
  GetEnvironments,
  Station,
} from "../../../services/environment.service.ts";
import { getCurrentUser } from "../../../services/users.service.ts";
import {
  CreateRequest,
  RequestSchedule,
} from "../../../services/request-environment.service.ts";

interface CreateEnvironmentDialogParams {
  onSuccess: () => void;
}

export function CreateScheduleDialog({
  onSuccess,
}: CreateEnvironmentDialogParams) {
  const [newSchedule, setNewSchedule] = useState({
    resourceType: "environment",
    description: "",
    selectedEnvironment: "",
    environmentId: "",
    selectedStation: "",
    stationId: "",
    day: "",
    startTime: "",
    endTime: "",
    userId: "",
    selectedUser: "",
    multiple: false,
  });

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  const [recurrent, setRecurrent] = useState<string>("nao");
  const [lastDay, setLastDay] = useState<string>("");

  const [checkedDays, setCheckedDays] = useState<number[]>([]);

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const currentUser = await getCurrentUser();
        setNewSchedule((prevSchedule) => ({
          ...prevSchedule,
          userId: currentUser.id || "",
        }));
      } catch (error) {
        console.error("Erro ao obter o ID do usuário logado:", error);
      }
    };

    fetchLoggedInUserId();
  }, []);

  useEffect(() => {
    async function fetchEnvironments() {
      try {
        const environmentsData = await GetEnvironments();
        setEnvironments(environmentsData);
      } catch (error) {
        console.error("Erro ao buscar ambientes:", error);
        toast.error("Erro ao buscar ambientes");
      }
    }

    fetchEnvironments();

    console.log(environments);
  }, []);

  const handleCheckboxChange = (event: any) => {
    const { value, checked } = event.target;
    if (checked) {
      // Adiciona o valor ao array de dias selecionados
      setCheckedDays([...checkedDays, parseInt(value)]);
    } else {
      // Remove o valor do array de dias selecionados
      setCheckedDays(checkedDays.filter((day) => day !== parseInt(value)));
    }
  };

  function handleChangeDescription(newValue: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      description: newValue,
    }));
  }

  function handleChangeResourceType(newType: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      resourceType: newType,
    }));
  }

  function handleRecurrent(newValue: string) {
    setRecurrent(newValue);
  }

  function fetchStation(envId: string) {
    environments.forEach((environment) => {
      if (environment.id === envId && environment.Station) {
        console.log(environment.Station);
        setStations(environment.Station);
        return;
      }
    });
  }

  function handleMultipleChange(multiple: boolean) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      multiple: multiple,
    }));
  }

  function handleEnvironmentChange(selectedEnv: string, envId: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      selectedEnvironment: selectedEnv || "",
      environmentId: envId || "",
    }));
    fetchStation(envId);
  }

  function handleUserChange(selectedUser: string, userId: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      selectedUser: selectedUser || "",
      userId: userId || "",
    }));
  }

  function handleStationChange(selectedStation: string, stationId: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      selectedStation: selectedStation || "",
      stationId: stationId || "",
    }));
  }

  function handleChangeDay(newValue: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      day: newValue,
    }));
  }

  function handleChangeStartTime(newValue: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      startTime: newValue,
    }));
  }

  function handleChangeEndTime(newValue: string) {
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      endTime: newValue,
    }));
  }

  function handleOpenChange() {
    handleChangeDescription("");
  }

  const handleSave = async () => {
    try {
      let formattedSchedule: RequestSchedule;

      if (recurrent === "sim") {
        const formattedCheckedDays = checkedDays.join(";");

        formattedSchedule = {
          resourceType: newSchedule.resourceType,
          description: newSchedule.description,
          startHour: newSchedule.startTime,
          endHour: newSchedule.endTime,
          userId: newSchedule.userId,
          resourceId: newSchedule.environmentId
            ? newSchedule.environmentId
            : newSchedule.stationId,
          startDay: newSchedule.day,
          endDay: lastDay,
          comment: "",
          recurrent: true,
          daysOfWeek: formattedCheckedDays,
          multiple: newSchedule.multiple,
        };
      } else {
        formattedSchedule = {
          resourceType: newSchedule.resourceType,
          description: newSchedule.description,
          startHour: newSchedule.startTime,
          endHour: newSchedule.endTime,
          userId: newSchedule.userId,
          resourceId:
            newSchedule.resourceType === "environment"
              ? newSchedule.environmentId
              : newSchedule.stationId,
          startDay: newSchedule.day,
          endDay: "",
          comment: "",
          recurrent: false,
          daysOfWeek: "",
          multiple: newSchedule.multiple,
        };
      }

      console.log(formattedSchedule);

      await CreateRequest(formattedSchedule);
      toast.success("Agendamento criado com sucesso");
      handleChangeDescription("");
      handleChangeEndTime("");
      handleChangeResourceType("environment");
      handleChangeStartTime("");
      handleEnvironmentChange("", "");
      handleRecurrent("nao");
      handleStationChange("", "");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao criar agendamento. Verifique suas credenciais e tente novamente."
      );
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-slate-200 p-3 flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors rounded-sm">
          <AlarmAddRounded /> Novo agendamento
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden overflow-y-auto inset-0 md:inset-auto md:right-0 md:top-0 md:max-w-[640px] py-10 px-10 w-full md:h-full bg-white flex flex-col outline-none">
          <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
            <X className="size-5 " />
          </Dialog.Close>

          <h3 className="text-2xl font-semibold text-slate-500 mb-10">
            Cadastrar novo agendamento
          </h3>

          <form className="flex-1 flex flex-col">
            <InputText
              text="Descrição do agendamento"
              icon={<DescriptionRounded />}
              placeholder="Descrição do agendamento"
              type="text"
              onChange={(e) => handleChangeDescription(e.target.value)}
              value={newSchedule.description}
            />

            <div className="flex flex-col mt-5">
              <label
                htmlFor="environmentSelect"
                className="text-slate-700 mb-2"
              >
                Ambiente
              </label>
              <select
                id="environmentSelect"
                value={newSchedule.selectedEnvironment || ""}
                onChange={(e) =>
                  handleEnvironmentChange(
                    e.target.value,
                    e.target.options[e.target.selectedIndex].getAttribute(
                      "data-id"
                    ) || ""
                  )
                }
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">
                  Selecione o ambiente que deseja agendar
                </option>
                {environments.map((environment) => (
                  <option
                    key={environment.id}
                    value={environment.name}
                    data-id={environment.id}
                  >
                    {environment.name}
                  </option>
                ))}
              </select>
            </div>

            {newSchedule.selectedEnvironment && (
              <>
                <div className="grid md:grid-cols-2 gap-4 w-full my-5">
                  <InputRadio
                    text="Ambiente"
                    icon={<HomeRounded />}
                    name="role"
                    value="environment"
                    checked={newSchedule.resourceType === "environment"}
                    onChange={() => handleChangeResourceType("environment")}
                  />
                  <InputRadio
                    text="Estação"
                    icon={<ChairAltRounded />}
                    name="role"
                    value="station"
                    checked={newSchedule.resourceType === "station"}
                    onChange={() => handleChangeResourceType("station")}
                  />
                </div>

                {newSchedule.resourceType == "station" && (
                  <div className="flex flex-col">
                    <label
                      htmlFor="stationSelect"
                      className="text-slate-700 mb-2"
                    >
                      Estação de estudo
                    </label>
                    <select
                      id="stationSelect"
                      value={newSchedule.selectedStation || ""}
                      onChange={(e) =>
                        handleStationChange(
                          e.target.value,
                          e.target.options[e.target.selectedIndex].getAttribute(
                            "data-id"
                          ) || ""
                        )
                      }
                      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">
                        Selecione a estação que deseja agendar
                      </option>
                      {stations.map((station) => (
                        <option
                          key={station.id}
                          value={station.name}
                          data-id={station.id}
                        >
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <InputText
                  text="Dia"
                  icon={<CalendarMonthRounded />}
                  placeholder="Dia"
                  type="date"
                  onChange={(e) => handleChangeDay(e.target.value)}
                  value={newSchedule.day}
                />

                <InputText
                  text="Hora de início"
                  icon={<AccessAlarmRounded />}
                  placeholder="Hora de início"
                  type="time"
                  onChange={(e) => handleChangeStartTime(e.target.value)}
                  value={newSchedule.startTime}
                />

                <InputText
                  text="Hora de término"
                  icon={<AccessAlarmRounded />}
                  placeholder="Hora de término"
                  type="time"
                  onChange={(e) => handleChangeEndTime(e.target.value)}
                  value={newSchedule.endTime}
                />

                {newSchedule.resourceType == "station" && (
                  <div className="mt-5">
                    <span>Agendamento múltiplo</span>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                      <InputRadio
                        text="Não"
                        icon={<ClearRounded />}
                        name="recurrent"
                        value="nao"
                        checked={recurrent === "nao"}
                        onChange={() => handleMultipleChange(false)}
                      />
                      <InputRadio
                        text="Sim"
                        icon={<CheckRounded />}
                        name="recurrent"
                        value="sim"
                        checked={recurrent === "sim"}
                        onChange={() => handleMultipleChange(true)}
                      />
                    </div>
                  </div>
                )}

                {newSchedule.resourceType != "station" && (
                  <div className="mt-5">
                    <span>Recorrente?</span>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                      <InputRadio
                        text="Não"
                        icon={<ClearRounded />}
                        name="recurrent"
                        value="nao"
                        checked={recurrent === "nao"}
                        onChange={() => handleRecurrent("nao")}
                      />
                      <InputRadio
                        text="Sim"
                        icon={<CheckRounded />}
                        name="recurrent"
                        value="sim"
                        checked={recurrent === "sim"}
                        onChange={() => handleRecurrent("sim")}
                      />
                    </div>
                  </div>
                )}

                {recurrent === "sim" && (
                  <>
                    <InputText
                      text="Último dia"
                      icon={<CalendarMonthRounded />}
                      placeholder="Dia"
                      type="date"
                      onChange={(e) => setLastDay(e.target.value)}
                      value={lastDay}
                    />
                    <div className="mt-4">
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={1}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(1)}
                        />{" "}
                        Segunda
                      </span>
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={2}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(2)}
                        />{" "}
                        Terça
                      </span>
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={3}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(3)}
                        />{" "}
                        Quarta
                      </span>
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={4}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(4)}
                        />{" "}
                        Quinta
                      </span>
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={5}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(5)}
                        />{" "}
                        Sexta
                      </span>
                      <span className="mr-3">
                        <input
                          type="checkbox"
                          name="daysOfWeek"
                          value={6}
                          onChange={handleCheckboxChange}
                          checked={checkedDays.includes(6)}
                        />{" "}
                        Sábado
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

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
    </Dialog.Root>
  );
}

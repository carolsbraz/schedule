import React, { useEffect, useRef, useState } from "react";
import { EditEnvironmentDialog } from "./dialog";

// Definições de tipos
interface Agendamento {
  data: string;
  horaInicio: string;
  horaFim: string;
  descricao: string;
}

interface Laboratorio {
  id: number;
  nome: string;
}

const laboratorios: Laboratorio[] = [
  { id: 1, nome: "Laboratório A" },
  { id: 2, nome: "Laboratório B" },
  { id: 3, nome: "Laboratório C" },
  { id: 4, nome: "Laboratório D" },
  { id: 5, nome: "Laboratório E" },
];

const agendamentos: Record<number, Agendamento[]> = {
  1: [
    {
      data: "2024-10-21",
      horaInicio: "10:00",
      horaFim: "12:00",
      descricao: "Experimento 1",
    },
    {
      data: "2024-10-21",
      horaInicio: "14:00",
      horaFim: "15:00",
      descricao: "Experimento 2",
    },
    {
      data: "2024-10-23",
      horaInicio: "09:00",
      horaFim: "10:30",
      descricao: "Experimento 5",
    },
  ],
  2: [
    {
      data: "2024-10-21",
      horaInicio: "11:00",
      horaFim: "13:00",
      descricao: "Experimento 3",
    },
    {
      data: "2024-10-23",
      horaInicio: "13:00",
      horaFim: "14:30",
      descricao: "Experimento 6",
    },
  ],
  3: [
    {
      data: "2024-10-21",
      horaInicio: "15:00",
      horaFim: "16:00",
      descricao: "Experimento 4",
    },
    {
      data: "2024-10-23",
      horaInicio: "10:30",
      horaFim: "12:00",
      descricao: "Experimento 7",
    },
  ],
  4: [
    {
      data: "2024-10-23",
      horaInicio: "09:00",
      horaFim: "11:00",
      descricao: "Experimento 8",
    },
    {
      data: "2024-10-23",
      horaInicio: "13:00",
      horaFim: "14:30",
      descricao: "Experimento 9",
    },
  ],
  5: [
    {
      data: "2024-10-23",
      horaInicio: "20:00",
      horaFim: "22:00",
      descricao: "Experimento 10",
    },
  ],
};

const AgendaLaboratorios: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [modoSemanal, setModoSemanal] = useState<boolean>(false);
  const [laboratorioSelecionado, setLaboratorioSelecionado] =
    useState<number>(1);

  const divRef = useRef<HTMLDivElement>(null);

  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(true);
  };

  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const alterarData = (incremento: number) => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + incremento);
    setDataSelecionada(novaData);
  };

  useEffect(() => {
    const dataAtual = new Date();

    const isSameDate =
      dataSelecionada.getFullYear() === dataAtual.getFullYear() &&
      dataSelecionada.getMonth() === dataAtual.getMonth() &&
      dataSelecionada.getDate() === dataAtual.getDate();

    setIsToday(isSameDate);
  }, [dataSelecionada]);

  const formatarData = (data: Date): string => {
    return data.toISOString().split("T")[0];
  };

  const calcularPosicaoGantt = (hora: string): number => {
    const [h, m] = hora.split(":").map(Number);
    const horaInicio = 8;
    return (h - horaInicio) * 200 + (m === 30 ? 100 : 0);
  };

  useEffect(() => {
    // Obtém a hora atual
    const agora = new Date();
    const horaAtual = `${agora.getHours()}:${agora.getMinutes()}`;
    const posicaoScroll = calcularPosicaoGantt(horaAtual);

    console.log(posicaoScroll);

    if (divRef.current) {
      const larguraDiv = divRef.current.clientWidth;
      divRef.current.scrollLeft = posicaoScroll - larguraDiv / 2;
    }
  }, []);

  const calcularPosicao = (hora: string): number => {
    const [h, m] = hora.split(":").map(Number);
    const horaInicio = 8;
    return (h - horaInicio) * 200 + (m === 30 ? 100 : 0);
  };

  const calcularPosicaoMarcador = (hora: string): number => {
    console.log(hora);
    const [h, m] = hora.split(":").map(Number);
    const minutos = h * 60 + m - 8 * 60;
    const minutesTotal = 14 * 60;
    const pixelsByMinute = 2810 / minutesTotal;
    return pixelsByMinute * minutos;
  };

  const renderizarAgendamentosDiarios = () => (
    <div className="grid grid-cols-7 gap-4">
      <div className="flex flex-col col-span-1">
        <div className="h-10"></div>
        {laboratorios.map((laboratorio) => (
          <div key={laboratorio.id} className="mt-4 mb-4 rounded flex">
            <h3 className="font-bold flex items-center min-w-[150px] h-20">
              {laboratorio.nome}
            </h3>
          </div>
        ))}
      </div>
      <div
        ref={divRef}
        className="flex flex-col relative col-span-6 bg-white w-full overflow-x-auto px-4"
      >
        {isToday ? (
          (() => {
            const left = calcularPosicaoMarcador(hora);
            return (
              <span
                className="bg-red-400 absolute w-[1px] h-[100%]"
                style={{ left: left }}
              ></span>
            );
          })()
        ) : (
          <></>
        )}
        <div className="flex rounded p-2 h-10 min-w-[2800px]">
          {Array.from({ length: 28 }, (_, intervalo) => {
            const hora = Math.floor(intervalo / 2) + 8;
            const minutos = intervalo % 2 === 0 ? "00" : "30";
            const horaFormatada = `${hora
              .toString()
              .padStart(2, "0")}:${minutos}`;

            return (
              <div
                key={intervalo}
                className="min-w-[100px] text-center border-r last:border-r-0"
              >
                {horaFormatada}
              </div>
            );
          })}
        </div>
        {laboratorios.map((laboratorio) => (
          <div
            className="relative h-20 mt-4 mb-4 w-full min-w-[2800px]"
            key={laboratorio.id}
          >
            {agendamentos[laboratorio.id]?.map((agendamento) => {
              if (agendamento.data === formatarData(dataSelecionada)) {
                const left: number = calcularPosicao(agendamento.horaInicio);
                const width: number =
                  calcularPosicao(agendamento.horaFim) - left;

                return (
                  <>
                    <EditEnvironmentDialog
                      agendamento={agendamento}
                      left={left}
                      width={width}
                    />
                  </>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const calcularPosicaoSemanal = (hora: string): number => {
    const [h, m] = hora.split(":").map(Number);
    const horaInicio = 8;
    return (h - horaInicio) * 50 + (m === 30 ? 25 : 0);
  };

  const renderizarAgendamentosSemanais = () => {
    return (
      <div className="grid grid-cols-7 gap-4">
        <div className="flex flex-col col-span-1">
          <div className="h-10"></div>
          {laboratorios.map((laboratorio) => (
            <div key={laboratorio.id} className="mt-4 mb-4 rounded flex">
              <h3 className="font-bold flex items-center min-w-[150px] h-20">
                {laboratorio.nome}
              </h3>
            </div>
          ))}
        </div>
        <div
          ref={divRef}
          className="flex flex-col relative col-span-6 bg-white w-full overflow-x-auto px-4"
        >
          {isToday ? (
            (() => {
              const left = calcularPosicaoMarcador(hora);
              return (
                <span
                  className="bg-red-400 absolute w-[1px] h-[100%]"
                  style={{ left: left }}
                ></span>
              );
            })()
          ) : (
            <></>
          )}
          <div className="flex rounded p-2 h-10 min-w-[2800px]">
            {Array.from({ length: 28 }, (_, intervalo) => {
              const hora = Math.floor(intervalo / 2) + 8;
              const minutos = intervalo % 2 === 0 ? "00" : "30";
              const horaFormatada = `${hora
                .toString()
                .padStart(2, "0")}:${minutos}`;

              return (
                <div
                  key={intervalo}
                  className="min-w-[100px] text-center border-r last:border-r-0"
                >
                  {horaFormatada}
                </div>
              );
            })}
          </div>
          {laboratorios.map((laboratorio) => (
            <div
              className="relative h-20 mt-4 mb-4 w-full min-w-[2800px]"
              key={laboratorio.id}
            >
              {agendamentos[laboratorio.id]?.map((agendamento) => {
                if (agendamento.data === formatarData(dataSelecionada)) {
                  const left = calcularPosicao(agendamento.horaInicio);
                  const width = calcularPosicao(agendamento.horaFim) - left;

                  return (
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
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => alterarData(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Anterior
        </button>
        <h2 className="text-lg font-bold">
          Agendamentos - {formatarData(dataSelecionada)}
        </h2>
        <button
          onClick={() => alterarData(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Próximo
        </button>
      </div>

      {/* Seletor de laboratório */}
      <div className="mb-4">
        <label className="mr-2">Selecionar Laboratório:</label>
        <select
          value={laboratorioSelecionado}
          onChange={(e) => setLaboratorioSelecionado(Number(e.target.value))}
          className="border rounded p-2"
        >
          {laboratorios.map((laboratorio) => (
            <option key={laboratorio.id} value={laboratorio.id}>
              {laboratorio.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botão para alternar entre visão diária e semanal */}
      <div className="flex mb-4">
        <button
          onClick={() => setModoSemanal(false)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            !modoSemanal ? "opacity-100" : "opacity-50"
          }`}
        >
          Diário
        </button>
        <button
          onClick={() => setModoSemanal(true)}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            modoSemanal ? "opacity-100" : "opacity-50"
          }`}
        >
          Semanal
        </button>
      </div>

      {/* Renderiza agendamentos com base no modo */}
      {modoSemanal
        ? renderizarAgendamentosSemanais()
        : renderizarAgendamentosDiarios()}
    </div>
  );
};

export default AgendaLaboratorios;

import { inject, Injectable } from "@angular/core";
import { ADDRESS_MOCKS } from "./addresses.service";
import { Diligence } from "../models/diligence";
import { CreateDiligenceDTO } from "../DTOS/create-attempt.dto";
import { UpdateDiligenceDTO } from "../DTOS/update-diligence.dto";
import { PaginatedResponse } from "../DTOS/paginated-response";
import { ApiResponse } from "../DTOS/api-response";
import { MOCK_ATTEMPT_LIST } from "./attempt.service";
import { Debtor } from "../models/debtor";
import { ApiService } from "./api";
function getaddressFor(diligenceId: string) {
  return ADDRESS_MOCKS.find((a: any) => a.diligenceId === diligenceId);
}
export const DILIGENCE_MOCKS: Diligence[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d004',
    protocol: 'CT-006',
    start: new Date('2023-01-06T00:00:00.000Z'),
    finish: new Date('2023-01-06T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Ricardo Santos',
    window: 'Sábado',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    plannerObservations: "Casa residencial com portão de correr.",
    attemptId: 'IT-01-CT-006',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d004'),
    factsObservations: [
      "Morador não foi localizado no imóvel no momento da diligência.",
      "Vizinha informou que o devedor costuma retornar no início da noite."
    ],
    propertyObservations: [
      "Imóvel residencial de alvenaria, com portão metálico e numeração visível.",
      "Sem sinais aparentes de abandono."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-04T13:10:00.000Z'),
    updatedAt: new Date('2023-01-06T09:30:00.000Z'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    imageUrls: ['https://img.magnific.com/psd-gratuitas/modelo-de-bone_1332-60619.jpg?semt=ais_hybrid&w=740&q=80', 'https://d1br4h274rc9sc.cloudfront.net/blog/por_que_usar_mockup_3241b3edb7.jpg']
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d016',
    protocol: 'CT-018',
    start: new Date('2023-01-18T00:00:00.000Z'),
    finish: new Date('2023-01-18T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Gustavo Lima',
    window: 'Manhã',
    concludedVisitNumber: 3,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    diligenceOrdinal: '3ª Diligência',
    attemptId: 'IT-03-CT-018',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d016'),
    factsObservations: [
      "Devedor localizado no endereço e ciente da pendência informada.",
      "Recebeu a notificação e solicitou prazo para regularização."
    ],
    propertyObservations: [
      "Residência ocupada, com acesso frontal pelo portão principal.",
      "Campainha localizada ao lado direito do portão."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-16T11:00:00.000Z'),
    updatedAt: new Date('2023-01-18T08:50:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001',
    protocol: 'CT-003',
    start: new Date('2023-01-03T00:00:00.000Z'),
    finish: new Date('2023-01-03T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Mariana Costa',
    window: 'Sábado',
    concludedVisitNumber: 1,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d001'),
    factsObservations: [
      "Imóvel estava fechado durante a visita.",
      "Comerciante próximo confirmou que há movimentação no endereço durante a tarde."
    ],
    propertyObservations: [
      "Casa térrea com fachada clara e portão de correr.",
      "Numeração parcialmente desgastada, mas ainda identificável."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-01T09:00:00.000Z'),
    updatedAt: new Date('2023-01-03T14:30:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d003',
    protocol: 'CT-005',
    start: new Date('2023-01-05T00:00:00.000Z'),
    finish: new Date('2023-01-05T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    debtorName: 'Mariana Costa',
    window: 'Manhã',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'f47ac10b-58cc-0003-a567-0e02b2c3d003',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d003'),
    factsObservations: [
      "Devedor não estava presente; familiar informou que retornaria posteriormente.",
      "Nova tentativa recomendada em horário comercial."
    ],
    propertyObservations: [
      "Sobrado residencial com garagem fechada.",
      "Interfone instalado junto à entrada principal."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-03T08:20:00.000Z'),
    updatedAt: new Date('2023-01-05T11:00:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d002',
    protocol: 'CT-004',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    start: new Date('2023-01-04T00:00:00.000Z'),
    finish: new Date('2023-01-04T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    plannerObservations: "Casa residencial com portão de correr.",
    debtorName: 'Carlos Souza',
    window: 'Tarde',
    concludedVisitNumber: 3,
    diligenceOrdinal: '3ª Diligência',
    attemptId: 'IT-03-CT-004',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d002'),
    factsObservations: [
      "Morador informou que o devedor não reside mais no local.",
      "Não foi apresentada informação sobre o novo endereço."
    ],
    propertyObservations: [
      "Imóvel aparenta estar ocupado por terceiros.",
      "Placa de aluguel não identificada na fachada."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-02T10:15:00.000Z'),
    updatedAt: new Date('2023-01-04T16:45:00.000Z')
  },

  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d005',
    protocol: 'CT-007',
    start: new Date('2023-01-07T00:00:00.000Z'),
    finish: new Date('2023-01-07T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Fernanda Lima',
    window: 'Manhã',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    attemptId: 'IT-01-CT-007',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d005'),
    factsObservations: [
      "Ninguém atendeu após duas chamadas no interfone.",
      "Movimentação interna foi percebida, mas não houve atendimento."
    ],
    propertyObservations: [
      "Edificação multifamiliar com acesso por portaria.",
      "Unidade indicada fica no segundo andar."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-05T07:50:00.000Z'),
    updatedAt: new Date('2023-01-07T15:20:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d006',
    protocol: 'CT-008',
    start: new Date('2023-01-08T00:00:00.000Z'),
    finish: new Date('2023-01-08T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    debtorName: 'Bruno Alencar',
    window: 'Tarde',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-008',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d006'),
    factsObservations: [
      "Devedor localizado e informou que já havia recebido contato anterior.",
      "Solicitou que a documentação fosse deixada com um responsável."
    ],
    propertyObservations: [
      "Residência com portão eletrônico e garagem frontal.",
      "Identificação do imóvel em boas condições."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-06T12:00:00.000Z'),
    updatedAt: new Date('2023-01-08T17:10:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d007',
    protocol: 'CT-009',
    start: new Date('2023-01-09T00:00:00.000Z'),
    finish: new Date('2023-01-09T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Juliana Vieira',
    window: 'Manhã',
    concludedVisitNumber: 3,
    diligenceOrdinal: '3ª Diligência',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    attemptId: 'IT-03-CT-009',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d007'),
    factsObservations: [
      "Imóvel fechado e sem contato com moradores.",
      "Vizinho relatou que o devedor permanece no endereço apenas à noite."
    ],
    propertyObservations: [
      "Casa de esquina com muro baixo e portão azul.",
      "Endereço possui numeração visível na lateral."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-07T09:40:00.000Z'),
    updatedAt: new Date('2023-01-09T10:05:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d008',
    protocol: 'CT-010',
    start: new Date('2023-01-10T00:00:00.000Z'),
    finish: new Date('2023-01-10T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Lucas Ferreira',
    window: 'Sábado',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    concludedVisitNumber: 1,
    plannerObservations: "Casa residencial com portão de correr.",
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-010',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d008'),
    factsObservations: [
      "Devedor não foi encontrado no local.",
      "Responsável pelo imóvel informou desconhecer o atual paradeiro."
    ],
    propertyObservations: [
      "Imóvel comercial com porta de aço e pequena identificação externa.",
      "Local aparenta funcionar em horário comercial."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-08T11:25:00.000Z'),
    updatedAt: new Date('2023-01-10T13:50:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d009',
    protocol: 'CT-011',
    start: new Date('2023-01-11T00:00:00.000Z'),
    finish: new Date('2023-01-11T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Beatriz Rocha',
    window: 'Tarde',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-011',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d009'),
    factsObservations: [
      "Devedor recebeu a diligência e confirmou seus dados.",
      "Informou que pretende procurar o responsável pelo contrato."
    ],
    propertyObservations: [
      "Residência com acesso lateral e campainha próxima ao portão.",
      "Fachada conservada e sem obstáculos de acesso."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-09T08:15:00.000Z'),
    updatedAt: new Date('2023-01-11T16:00:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d010',
    protocol: 'CT-012',
    start: new Date('2023-01-12T00:00:00.000Z'),
    finish: new Date('2023-01-12T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Rodrigo Melo',
    window: 'Manhã',
    concludedVisitNumber: 1,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-012',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d010'),
    factsObservations: [
      "Não houve atendimento no endereço.",
      "Vizinha confirmou que a família reside no local."
    ],
    propertyObservations: [
      "Casa térrea com portão de ferro e garagem aberta.",
      "Número do imóvel claramente visível."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-10T10:30:00.000Z'),
    plannerObservations: "Casa residencial com portão de correr.",
    updatedAt: new Date('2023-01-12T09:15:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d011',
    protocol: 'CT-013',
    start: new Date('2023-01-13T00:00:00.000Z'),
    finish: new Date('2023-01-13T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    debtorName: 'Camila Pires',
    window: 'Tarde',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-013',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d011'),
    factsObservations: [
      "Devedor estava ausente no momento da visita.",
      "Familiar presente recusou-se a fornecer informações adicionais."
    ],
    propertyObservations: [
      "Sobrado com entrada independente e interfone.",
      "Acesso principal em boas condições."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-11T14:00:00.000Z'),
    updatedAt: new Date('2023-01-13T15:45:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d012',
    protocol: 'CT-014',
    start: new Date('2023-01-14T00:00:00.000Z'),
    finish: new Date('2023-01-14T02:00:00.000Z'),
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    notificatorName: 'Gabriel Grote',
    debtorName: 'Thiago Ribeiro',
    window: 'Sábado',
    concludedVisitNumber: 3,
    diligenceOrdinal: '3ª Diligência',
    attemptId: 'IT-03-CT-014',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d012'),
    factsObservations: [
      "Devedor localizado e notificado sobre a pendência.",
      "Demonstrou interesse em negociar a regularização."
    ],
    propertyObservations: [
      "Imóvel residencial com garagem frontal.",
      "Portão eletrônico e campainha funcionando."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-12T09:20:00.000Z'),
    updatedAt: new Date('2023-01-14T11:30:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d013',
    protocol: 'CT-015',
    start: new Date('2023-01-15T00:00:00.000Z'),
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    finish: new Date('2023-01-15T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Amanda Martins',
    window: 'Manhã',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-015',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d013'),
    factsObservations: [
      "Endereço visitado sem sucesso.",
      "Não houve resposta às tentativas de contato realizadas no local."
    ],
    propertyObservations: [
      "Prédio residencial com portaria eletrônica.",
      "Apartamento indicado no cadastro não possui identificação externa."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-13T08:00:00.000Z'),
    updatedAt: new Date('2023-01-15T10:20:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d014',
    protocol: 'CT-016',
    start: new Date('2023-01-16T00:00:00.000Z'),
    finish: new Date('2023-01-16T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Felipe Cardoso',
    window: 'Sábado',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    plannerObservations: "Casa residencial com portão de correr.",
    attemptId: 'IT-02-CT-016',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d014'),
    factsObservations: [
      "Devedor não foi localizado.",
      "Vizinho relatou que o imóvel costuma ficar fechado durante o período da manhã."
    ],
    propertyObservations: [
      "Casa de alvenaria com muro frontal alto.",
      "Numeração visível junto ao portão."
    ],
    porHoraCerta: false,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    createdAt: new Date('2023-01-14T13:40:00.000Z'),
    updatedAt: new Date('2023-01-16T14:00:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d015',
    protocol: 'CT-017',
    start: new Date('2023-01-17T00:00:00.000Z'),
    finish: new Date('2023-01-17T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Larissa Nunes',
    window: 'Tarde',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    plannerObservations: "Casa residencial com portão de correr.",
    attemptId: 'IT-01-CT-017',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d015'),
    factsObservations: [
      "Responsável pelo imóvel informou que o devedor saiu recentemente.",
      "Não soube indicar novo endereço."
    ],
    propertyObservations: [
      "Imóvel residencial aparentemente desocupado.",
      "Caixa de correio apresenta acúmulo de correspondências."
    ],
    porHoraCerta: false,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    createdAt: new Date('2023-01-15T09:10:00.000Z'),
    updatedAt: new Date('2023-01-17T17:00:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d017',
    protocol: 'CT-019',
    start: new Date('2023-01-19T00:00:00.000Z'),
    finish: new Date('2023-01-19T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Patricia Mendes',
    window: 'Tarde',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-019',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d017'),
    factsObservations: [
      "Devedor localizado e ciente da diligência.",
      "Informou que pretende apresentar comprovantes posteriormente."
    ],
    propertyObservations: [
      "Residência com acesso por corredor lateral.",
      "Portão principal possui interfone."
    ],
    porHoraCerta: true,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    createdAt: new Date('2023-01-17T15:30:00.000Z'),
    updatedAt: new Date('2023-01-19T16:10:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d018',
    protocol: 'CT-020',
    start: new Date('2023-01-20T00:00:00.000Z'),
    finish: new Date('2023-01-20T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Leonardo Cruz',
    window: 'Sábado',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-020',
    plannerObservations: "Casa residencial com portão de correr.",
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d018'),
    factsObservations: [
      "Não houve atendimento no endereço.",
      "Tentativas de contato realizadas em diferentes horários sem sucesso."
    ],
    propertyObservations: [
      "Casa térrea com garagem coberta.",
      "Fachada sem alterações relevantes desde a visita anterior."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-18T10:00:00.000Z'),
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    updatedAt: new Date('2023-01-20T09:40:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d019',
    protocol: 'CT-021',
    start: new Date('2023-01-21T00:00:00.000Z'),
    finish: new Date('2023-01-21T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Isabela Fontes',
    window: 'Manhã',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-021',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d019'),
    factsObservations: [
      "Devedor foi localizado após contato com responsável pelo imóvel.",
      "Recebeu as informações referentes à pendência."
    ],
    propertyObservations: [
      "Imóvel comercial/residencial de uso misto.",
      "Entrada principal identificada por placa numérica."
    ],
    porHoraCerta: true,
    createdAt: new Date('2023-01-19T08:25:00.000Z'),
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    updatedAt: new Date('2023-01-21T12:00:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d020',
    protocol: 'CT-022',
    start: new Date('2023-01-22T00:00:00.000Z'),
    finish: new Date('2023-01-22T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Daniel Barbosa',
    window: 'Tarde',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-022',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d020'),
    plannerObservations: "Casa residencial com portão de correr.",
    factsObservations: [
      "Morador informou que o devedor não se encontrava no local.",
      "Foi orientado a repassar o contato da administradora."
    ],
    propertyObservations: [
      "Apartamento em condomínio residencial.",
      "Acesso ao prédio depende de portaria."
    ],
    porHoraCerta: false,
    createdAt: new Date('2023-01-20T14:15:00.000Z'),
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    updatedAt: new Date('2023-01-22T15:30:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d021',
    protocol: 'CT-023',
    start: new Date('2023-01-23T00:00:00.000Z'),
    finish: new Date('2023-01-23T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Vanessa Dias',
    window: 'Sábado',
    concludedVisitNumber: 3,
    diligenceOrdinal: '3ª Diligência',
    attemptId: 'IT-03-CT-023',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d021'),
    factsObservations: [
      "Devedor não localizado.",
      "Vizinho informou que o imóvel é ocupado principalmente no período noturno."
    ],
    propertyObservations: [
      "Residência com portão metálico e garagem estreita.",
      "Número do imóvel visível na fachada."
    ],
    porHoraCerta: false,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    createdAt: new Date('2023-01-21T09:50:00.000Z'),
    updatedAt: new Date('2023-01-23T11:20:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d022',
    protocol: 'CT-024',
    start: new Date('2023-01-24T00:00:00.000Z'),
    finish: new Date('2023-01-24T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Renan Moreira',
    window: 'Manhã',
    concludedVisitNumber: 1,
    diligenceOrdinal: '1ª Diligência',
    attemptId: 'IT-01-CT-024',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d022'),
    factsObservations: [
      "Devedor recebeu a diligência pessoalmente.",
      "Confirmou ciência da pendência e ficou de buscar orientação."
    ],
    propertyObservations: [
      "Casa de dois pavimentos, com acesso frontal independente.",
      "Campainha instalada junto ao portão."
    ],
    porHoraCerta: true,
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    plannerObservations: "Casa residencial com portão de correr.",
    createdAt: new Date('2023-01-22T07:40:00.000Z'),
    updatedAt: new Date('2023-01-24T08:10:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d023',
    protocol: 'CT-025',
    start: new Date('2023-01-25T00:00:00.000Z'),
    finish: new Date('2023-01-25T02:00:00.000Z'),
    notificatorName: 'Marcelo Lopes',
    debtorName: 'Gabriela Ramos',
    window: 'Tarde',
    concludedVisitNumber: 2,
    diligenceOrdinal: '2ª Diligência',
    attemptId: 'IT-02-CT-025',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d023'),
    factsObservations: [
      "Imóvel fechado durante a visita.",
      "Não foram obtidas novas informações sobre o devedor."
    ],
    propertyObservations: [
      "Residência com fachada em reforma.",
      "Numeração temporária afixada próxima à entrada."
    ],
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    plannerObservations: "Casa residencial com portão de correr.",
    porHoraCerta: false,
    createdAt: new Date('2023-01-23T13:00:00.000Z'),
    updatedAt: new Date('2023-01-25T14:45:00.000Z')
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d024',
    protocol: 'CT-026',
    start: new Date('2023-01-26T00:00:00.000Z'),
    finish: new Date('2023-01-26T02:00:00.000Z'),
    notificatorName: 'Gabriel Grote',
    debtorName: 'Eduardo Antunes',
    window: 'Sábado',
    concludedVisitNumber: 3,
    diligenceOrdinal: '3ª Diligência',
    attemptId: 'IT-03-CT-026',
    address: getaddressFor('f47ac10b-58cc-4372-a567-0e02b2c3d024'),
    factsObservations: [
      "Devedor não estava presente.",
      "Familiar informou que ele retornaria no final da tarde."
    ],
    propertyObservations: [
      "Casa residencial com portão de correr.",
      "Acesso principal livre e endereço devidamente identificado."
    ],
    generalObservations: ["Casa residencial com portão de correr.", "Acesso principal livre e endereço devidamente identificado."],
    plannerObservations: "Casa residencial com portão de correr.",
    porHoraCerta: true,
    createdAt: new Date('2023-01-24T10:10:00.000Z'),
    updatedAt: new Date('2023-01-26T16:30:00.000Z')
  }
];


@Injectable({ providedIn: 'root' })
export class DiligencesService {
  private api = inject(ApiService);
  async getDiligenceById(id: string) {
    // Simula uma busca no banco de dados
    return { success: true, data: DILIGENCE_MOCKS.find(diligence => diligence.id === id) };
  }
  async create(dto: CreateDiligenceDTO) {
    console.log('Diligence created')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001' } };
  }
  async update(id: string, dto: UpdateDiligenceDTO) {
    console.log('Diligence updated')
    console.log(JSON.stringify(dto, null, 2))
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d001' } };
  }
  async getLastDiligences(page: number = 1, pageSize: number = 8): Promise<ApiResponse<PaginatedResponse<Diligence[]>>> {
    // FILTRO APLICARIA AQ
    const params: any = {
      page, pageSize
    }
    return await this.api.get<PaginatedResponse<Diligence[]>>('api/diligences/last', { params })
  }
  async getDiligencesByAttemptId(id: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: DILIGENCE_MOCKS.filter(att => att.attemptId == id) };
  }
  async getLastDiligenceByAttemptId(id: string) {
    const lastDiligenceId = MOCK_ATTEMPT_LIST.find(attempt => attempt.id == id)?.lastDiligenceId
    const lastDiligence = DILIGENCE_MOCKS.find(diligence => diligence.id == lastDiligenceId)
    return { success: true, data: lastDiligence }
  }
  async getDebtorByDiligenceId(id: string): Promise<ApiResponse<Debtor>> {
    return await this.api.get<Debtor>('api/debtors/diligence/' + id)
  }
}
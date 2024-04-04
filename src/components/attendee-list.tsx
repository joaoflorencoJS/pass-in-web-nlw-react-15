import {
  Search,
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { IconButton } from './icon-buttons';
import { Table } from './table/table';
import { TableHeader } from './table/table-header';
import { TableData } from './table/table-data';
import { TableRow } from './table/table-row';
import { ChangeEvent, useState } from 'react';
import { attendees } from '../data/attendees';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export function AttendeeList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(attendees.length / 10);

  const goToNextPage = () => {
    setPage(page + 1);
  };
  const goToPreviousPage = () => {
    setPage(page - 1);
  };

  const goToLastPage = () => {
    setPage(totalPages);
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const onSearchInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            type="search"
            placeholder="Buscar participante..."
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm"
          />

          {search}
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border-white/10 checked:bg-orange-400"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de inscrição</TableHeader>
            <TableHeader>Data de check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.slice((page - 1) * 10, page * 10).map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableData>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border-white/10 checked:bg-orange-400"
                  />
                </TableData>
                <TableData>{attendee.id}</TableData>
                <TableData>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableData>
                <TableData>{dayjs().to(attendee.createdAt)}</TableData>
                <TableData>{dayjs().to(attendee.checkedInAt)}</TableData>
                <TableData>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableData>
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableData colSpan={3}>
              Mostrando {page * 10 > attendees.length ? attendees.length : page * 10} de{' '}
              {attendees.length} itens
            </TableData>
            <TableData className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>

                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableData>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

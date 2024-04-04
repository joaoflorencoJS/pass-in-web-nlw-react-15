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
import { ChangeEvent, useEffect, useState } from 'react';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());
    return url.searchParams.get('search') ?? '';
  });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / 10);

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());
    const hasPage = url.searchParams.has('page');

    if (hasPage && Number(url.searchParams.get('page')) <= totalPages)
      return Number(url.searchParams.get('page'));

    if (hasPage) {
      url.searchParams.set('page', '1');
      window.history.pushState({}, '', url);
    }

    return 1;
  });

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees'
    );

    url.searchParams.set('pageIndex', String(page - 1));

    if (search.length > 0) url.searchParams.set('query', search);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAttendees(data.attendees);
        setTotal(data.total);
      });
  }, [page, search]);

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set('search', search);

    window.history.pushState({}, '', url);

    setSearch(search);
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set('page', String(page));

    window.history.pushState({}, '', url);

    setPage(page);
  }

  const goToNextPage = () => {
    setCurrentPage(page + 1);
  };
  const goToPreviousPage = () => {
    setCurrentPage(page - 1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const onSearchInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChanged}
            value={search}
            type="search"
            placeholder="Buscar participante..."
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
          />
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
          {attendees.map((attendee) => {
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
                <TableData>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableData>
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
              Mostrando {page * 10 > total ? total : page * 10} de {total} itens
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

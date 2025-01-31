import { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField
} from '@mui/material';
import { ContentCopy, Delete, Send } from '@mui/icons-material';
import './DnsResolver.css';

interface ResourceRecord {
  name: string;
  type: number;
  TTL?: number;
  data?: string;
}

interface SuccessfulResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: ResourceRecord[];
  Answer?: ResourceRecord[];
  Authority?: ResourceRecord[];
  Additional?: ResourceRecord[];
  Comment?: string[];
}

interface ErrorResponse {
  error: string;
}

type DnsResponse = SuccessfulResponse | ErrorResponse;

function isErrorResponse(response: DnsResponse): response is ErrorResponse {
  return (response as ErrorResponse).error !== undefined;
}

const TYPES: Record<number, [string, boolean]> = {
  1: ['A', true],
  2: ['NS', true],
  3: ['MD', false],
  4: ['MF', false],
  5: ['CNAME', false],
  6: ['SOA', true],
  7: ['MB', false],
  8: ['MG', false],
  9: ['MR', false],
  10: ['NULL', false],
  11: ['WKS', false],
  12: ['PTR', false],
  13: ['HINFO', false],
  14: ['MINFO', false],
  15: ['MX', true],
  16: ['TXT', true],
  17: ['RP', false],
  18: ['AFSDB', false],
  19: ['X25', false],
  20: ['ISDN', false],
  21: ['RT', false],
  22: ['NSAP', false],
  23: ['NSAP', false],
  24: ['SIG', false],
  25: ['KEY', false],
  26: ['PX', false],
  27: ['GPOS', false],
  28: ['AAAA', true],
  29: ['LOC', false],
  30: ['NXT', false],
  31: ['EID', false],
  32: ['NIMLOC', false],
  33: ['SRV', false],
  34: ['ATMA', false],
  35: ['NAPTR', false],
  36: ['KX', false],
  37: ['CERT', false],
  38: ['A6', false],
  39: ['DNAME', false],
  40: ['SINK', false],
  41: ['OPT', false],
  42: ['APL', false],
  43: ['DS', false],
  44: ['SSHFP', false],
  45: ['IPSECKEY', false],
  46: ['RRSIG', false],
  47: ['NSEC', false],
  48: ['DNSKEY', false],
  49: ['DHCID', false],
  50: ['NSEC3', false],
  51: ['NSEC3PARAM', false],
  52: ['TLSA', false],
  53: ['SMIMEA', false],
  55: ['HIP', false],
  56: ['NINFO', false],
  57: ['RKEY', false],
  58: ['TALINK', false],
  59: ['CDS', false],
  60: ['CDNSKEY', false],
  61: ['OPENPGPKEY', false],
  62: ['CSYNC', false],
  63: ['ZONEMD', false],
  64: ['SVCB', false],
  65: ['HTTPS', false],
  99: ['SPF', false],
  100: ['UINFO', false],
  101: ['UID', false],
  102: ['GID', false],
  103: ['UNSPEC', false],
  104: ['NID', false],
  105: ['L32', false],
  106: ['L64', false],
  107: ['LP', false],
  108: ['EUI48', false],
  109: ['EUI64', false],
  249: ['TKEY', false],
  250: ['TSIG', false],
  251: ['IXFR', false],
  252: ['AXFR', false],
  253: ['MAILB', false],
  254: ['MAILA', false],
  255: ['*', false],
  256: ['URI', false],
  257: ['CAA', false],
  258: ['AVC', false],
  259: ['DOA', false],
  260: ['AMTRELAY', false],
  32768: ['TA', false],
  32769: ['DLV', false],
};

interface Response {
  name: string;
  type: number;
  TTL: number;
  data: string[];
}

function DnsResolver() {
  const [name, setName] = useState('');
  const [type, setType] = useState('1');
  const [responses, setResponses] = useState<Response[]>([]);
  const [pending, setPending] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const resolve = () => {
    setPending(true);
    const params = new URLSearchParams({ name, type });
    fetch(`https://cloudflare-dns.com/dns-query?${params}`, {
      headers: {
        accept: 'application/dns-json',
      },
    })
      .then((r) => r.json())
      .then((r: DnsResponse) => {
        if (isErrorResponse(r)) {
          enqueueSnackbar(r.error, {
            variant: 'error',
          });
        } else {
          const res = r.Answer
            ?.map((r) => ({
              name: r.name,
              type: r.type,
              TTL: r.TTL,
              data: [r.data],
            }))
            .reduce((a, c) => ({
              name: a.name,
              type: a.type,
              TTL: a.TTL,
              data: [...a.data, ...c.data],
            }));
          if (res) {
            setResponses([res as Response, ...responses]);
          } else {
            enqueueSnackbar('No answer', {
              variant: 'warning',
            });
          }
        }
      })
      .catch(console.error)
      .then(() => setPending(false));
  };

  return (
    <Grid2
      component='form'
      container
      spacing={1}
      sx={{ p: 2 }}
      onSubmit={(e) => {
        e.preventDefault();
        resolve();
      }}
    >
      <Grid2 size={{ xs: 4, sm: 2 }}>
        <TextField
          fullWidth
          label='Type'
          select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {
            Object
              .entries(TYPES)
              .filter(([, pair]) => pair[1])
              .map(([c, [n]]) => <MenuItem key={c} value={c}>{n}</MenuItem>)
          }
        </TextField>
      </Grid2>
      <Grid2 size={{ xs: 8, sm: 10 }}>
        <TextField
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <IconButton type='submit' disabled={pending}>
                  {pending ? <CircularProgress /> : <Send />}
                </IconButton>
              ),
            }
          }}
          label='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Grid2>
      {responses.map((r, i) => (
        <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardHeader
              title={r.name}
              subheader={`${TYPES[r.type][0]}, TTL: ${r.TTL}`}
              action={
                <IconButton onClick={() => {
                  responses.splice(i, 1);
                  setResponses([...responses]);
                }}>
                  <Delete />
                </IconButton>
              }
            />
            <CardContent>
              <List>
                {r.data.map((d, i) => (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <IconButton edge='end' onClick={() => navigator.clipboard.writeText(d)}>
                        <ContentCopy />
                      </IconButton>
                    }>
                    <ListItemText className='rec-val' primary={d} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
}

export default DnsResolver;

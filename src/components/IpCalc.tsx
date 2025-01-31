import { ClipboardEventHandler, useCallback, useEffect, useState } from 'react';
import { IPv4 } from 'ipaddr.js';
import { Grid2, InputAdornment, Slider, TextField } from '@mui/material';

const toHexIpAddress = (ipAddress: IPv4) => {
  try {
    return ipAddress
      .toByteArray()
      .map((o) => '0' + o.toString(16).toUpperCase())
      .map((s) => s.substring(s.length - 2, s.length))
      .join('.');
  } catch {
    return ''
  }
};

const toWildcardMask = (subnetMask: IPv4) => {
  try {
    return subnetMask
      .toByteArray()
      .map((o) => ~o & 0xFF)
      .join('.');
  } catch {
    return ''
  }
};

function IpCalc() {
  const [ipAddress, setIpAddress_] = useState('192.168.2.1');
  const [ipAddressError, setIpAddressError] = useState(false);
  const [subnetMask, setSubnetMask_] = useState('255.255.255.0');
  const [subnetMaskError, setSubnetMaskError] = useState(false);
  const [maskBits, setMaskBits_] = useState('24');
  const [maskBitsError, setMaskBitsError] = useState(false);

  const [parsedAddress, setParsedAddress] = useState(() => IPv4.parse(ipAddress));
  const [parsedSubnet, setParsedSubnet] = useState(() => IPv4.parse(subnetMask));
  const [prefixLength, setPrefixLength] = useState(~~maskBits);
  const [networkAddress, setNetworkAddress] = useState(() => IPv4.networkAddressFromCIDR(`${ipAddress}/${maskBits}`).toNormalizedString());
  const [broadcastAddress, setBroadcastAddress] = useState(() => IPv4.broadcastAddressFromCIDR(`${ipAddress}/${maskBits}`).toNormalizedString());

  const setIpAddress = useCallback((value: string) => {
    setIpAddress_(value);

    try {
      setParsedAddress(IPv4.parse(value));
      setIpAddressError(false);
    } catch {
      setIpAddressError(true);
    }
  }, [])

  const setSubnetMask = useCallback((value: string) => {
    setSubnetMask_(value);

    try {
      const parsed = IPv4.parse(value);
      const length = parsed.prefixLengthFromSubnetMask();
      if (length !== null) {
        setParsedSubnet(parsed);
        setPrefixLength(length);
        setMaskBits_(length.toString());
      }
      setSubnetMaskError(length === null);
    } catch {
      setSubnetMaskError(true);
    }
  }, []);

  const setMaskBits = useCallback((value: string) => {
    setMaskBits_(value);

    const length = Math.trunc(Number(value));
    if (0 <= length && length <= 32) {
      const parsedSubnet = IPv4.subnetMaskFromPrefixLength(length);
      setParsedSubnet(parsedSubnet);
      setPrefixLength(length);
      setSubnetMask_(parsedSubnet.toNormalizedString());
      setMaskBitsError(false);
    } else {
      setMaskBitsError(true);
    }
  }, []);

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = (e) => {
    const data = e.clipboardData.getData('text').trim();
    if (data === '') return;

    if (IPv4.isValidCIDR(data)) {
      e.preventDefault();
      const [ip, length] = IPv4.parseCIDR(data);
      setIpAddress(ip.toNormalizedString());
      setMaskBits(length.toString());
    } else if (IPv4.isValid(data)) {
      e.preventDefault();
      setIpAddress(data);
    }
  };

  useEffect(() => {
    const cidr = `${parsedAddress.toNormalizedString()}/${prefixLength}`;
    setNetworkAddress(IPv4.networkAddressFromCIDR(cidr).toNormalizedString());
    setBroadcastAddress(IPv4.broadcastAddressFromCIDR(cidr).toNormalizedString());
  }, [parsedAddress, prefixLength])

  return (
    <Grid2 container spacing={2} alignItems='center' sx={{
      p: 2,
    }}>
      <Grid2 size={6}>
        <TextField
          error={ipAddressError}
          fullWidth
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          label='IP Address'
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          onPaste={handlePaste}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          disabled
          fullWidth
          label='Hex IP Address'
          value={toHexIpAddress(parsedAddress)}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          error={subnetMaskError}
          fullWidth
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          label='Subnet Mask'
          value={subnetMask}
          onChange={(e) => setSubnetMask(e.target.value)}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          disabled
          fullWidth
          label='Wildcard Mask'
          value={toWildcardMask(parsedSubnet)}
        />
      </Grid2>
      <Grid2 size={12}>
        <TextField
          error={maskBitsError}
          fullWidth
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              max: 32,
              min: 0,
              step: 1,
              type: 'number',
              sx: {
                textAlign: 'right',
                width: '25%',
              },
            },
            input: {
              endAdornment: (
                <InputAdornment position='end' sx={{ width: '100%', paddingX: 2 }}>
                  <Slider
                    max={32}
                    min={0}
                    value={~~maskBits}
                    sx={{}}
                    onChange={(_e, value) => setMaskBits(value.toString())}
                  />
                </InputAdornment>
              ),
            },
          }}
          label='Mask Bits'
          value={maskBits}
          onChange={(e) => setMaskBits(e.target.value)}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          disabled
          fullWidth
          label='Network Address'
          value={networkAddress}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          disabled
          fullWidth
          label='Broadcast Address'
          value={broadcastAddress}
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          disabled
          fullWidth
          slotProps={{ htmlInput: { sx: { textAlign: 'right' } } }}
          label='Number of addresses'
          value={(1n << BigInt(32 - prefixLength)).toString()}
        />
      </Grid2>
    </Grid2>
  );
}

export default IpCalc;

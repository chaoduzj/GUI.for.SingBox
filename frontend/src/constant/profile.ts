import { sampleID } from '@/utils'
import type { ProfileType } from '@/stores'
import { ProxyGroup, FinalDnsType } from '@/constant'
import i18n from '@/lang'
const { t } = i18n.global

export const GeneralConfigDefaults = (): ProfileType['generalConfig'] => ({
  mode: 'rule',
  'mixed-port': 20122,
  'allow-lan': false,
  'log-level': 'info',
  'interface-name': ''
})

export const AdvancedConfigDefaults = (): ProfileType['advancedConfig'] => ({
  port: 0,
  'socks-port': 0,
  secret: sampleID(),
  'external-controller': '127.0.0.1:20123',
  'external-ui': '',
  'external-ui-url': '',
  profile: {
    'store-cache': true,
    'store-fake-ip': false
  },
  domain_strategy: '',
  'tcp-fast-open': false,
  'tcp-multi-path': false,
  'udp-fragment': false,
  sniff: true,
  'sniff-override-destination': false
})

export const TunConfigDefaults = (): ProfileType['tunConfig'] => ({
  enable: false,
  stack: 'System',
  'auto-route': true,
  interface_name: 'singbox',
  mtu: 9000,
  'strict-route': true,
  'endpoint-independent-nat': false,
  'inet4-address': '172.19.0.1/30',
  'inet6-address': 'fdfe:dcba:9876::1/126'
})

export const DnsConfigDefaults = (): ProfileType['dnsConfig'] => ({
  enable: true,
  fakeip: false,
  strategy: '',
  'local-dns': 'https://223.5.5.5/dns-query',
  'remote-dns': 'tls://8.8.8.8',
  'resolver-dns': '223.5.5.5',
  'remote-resolver-dns': '8.8.8.8',
  'final-dns': FinalDnsType.Remote,
  'remote-dns-detour': t('outbound.select'),
  'fake-ip-range-v4': '198.18.0.1/16',
  'fake-ip-range-v6': 'fc00::/18',
  'fake-ip-filter': [
    '.lan',
    '.localdomain',
    '.example',
    '.invalid',
    '.localhost',
    '.test',
    '.local',
    '.home.arpa',
    '.msftconnecttest.com',
    '.msftncsi.com'
  ]
})

export const ProxyGroupsConfigDefaults = (): ProfileType['proxyGroupsConfig'] => {
  const id1 = sampleID()
  const id2 = sampleID()
  const id3 = sampleID()
  const id4 = sampleID()
  const id5 = sampleID()

  return [
    {
      id: id1,
      tag: t('outbound.select'),
      type: ProxyGroup.Select,
      proxies: [{ id: id2, type: 'built-in', tag: t('outbound.urltest') }],
      use: [],
      url: '',
      interval: 300,
      tolerance: 150,
      filter: ''
    },
    {
      id: id2,
      tag: t('outbound.urltest'),
      type: ProxyGroup.UrlTest,
      proxies: [],
      use: [],
      url: 'https://www.gstatic.com/generate_204',
      interval: 300,
      tolerance: 150,
      filter: ''
    },
    {
      id: id3,
      tag: t('outbound.direct'),
      type: ProxyGroup.Select,
      proxies: [{ id: 'direct', type: 'built-in', tag: 'direct' }],
      use: [],
      url: '',
      interval: 300,
      tolerance: 150,
      filter: ''
    },
    {
      id: id4,
      tag: t('outbound.block'),
      type: ProxyGroup.Select,
      proxies: [{ id: 'block', type: 'built-in', tag: 'block' }],
      use: [],
      url: '',
      interval: 300,
      tolerance: 150,
      filter: ''
    },
    {
      id: id5,
      tag: t('outbound.fallback'),
      type: ProxyGroup.Select,
      proxies: [
        { id: id1, type: 'built-in', tag: t('outbound.select') },
        { id: id3, type: 'built-in', tag: t('outbound.direct') }
      ],
      use: [],
      url: '',
      interval: 300,
      tolerance: 150,
      filter: ''
    }
  ]
}

export const RulesConfigDefaults = (): ProfileType['rulesConfig'] => [
  {
    id: sampleID(),
    type: 'inline',
    payload: JSON.stringify({ protocol: 'dns', port: 53 }, null, 2),
    proxy: 'dns-out',
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  },
  {
    id: sampleID(),
    type: 'inline',
    payload: JSON.stringify({ network: 'udp', port: 443 }, null, 2),
    proxy: t('outbound.block'),
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  },
  {
    id: sampleID(),
    type: 'clash_mode',
    payload: 'direct',
    proxy: t('outbound.direct'),
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  },
  {
    id: sampleID(),
    type: 'clash_mode',
    payload: 'global',
    proxy: t('outbound.select'),
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload:
      'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/category-ads-all.srs',
    proxy: t('outbound.block'),
    'ruleset-name': 'CATEGORY-ADS',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct'),
    invert: false
  },
  {
    id: sampleID(),
    type: 'ip_is_private',
    payload: '',
    proxy: t('outbound.direct'),
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload: 'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip/cn.srs',
    proxy: t('outbound.direct'),
    'ruleset-name': 'GEOIP-CN',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct'),
    invert: false
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload: 'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/cn.srs',
    proxy: t('outbound.direct'),
    'ruleset-name': 'GEOSITE-CN',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct'),
    invert: false
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload:
      'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/geolocation-!cn.srs',
    proxy: t('outbound.select'),
    'ruleset-name': 'GEOLOCATION-!CN',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct'),
    invert: false
  },
  {
    id: sampleID(),
    type: 'final',
    payload: '',
    proxy: t('outbound.fallback'),
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': '',
    invert: false
  }
]

export const DnsRulesConfigDefaults = (): ProfileType['dnsRulesConfig'] => [
  {
    id: sampleID(),
    type: 'outbound',
    payload: 'any',
    server: 'local-dns',
    invert: false,
    'disable-cache': true,
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': ''
  },
  {
    id: sampleID(),
    type: 'fakeip',
    payload: '',
    server: 'fakeip-dns',
    invert: false,
    'disable-cache': false,
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': ''
  },
  {
    id: sampleID(),
    type: 'clash_mode',
    payload: 'direct',
    server: 'local-dns',
    invert: false,
    'disable-cache': false,
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': ''
  },
  {
    id: sampleID(),
    type: 'clash_mode',
    payload: 'global',
    server: 'remote-dns',
    invert: false,
    'disable-cache': false,
    'ruleset-name': '',
    'ruleset-format': '',
    'download-detour': ''
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload: 'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/cn.srs',
    server: 'local-dns',
    'disable-cache': false,
    invert: false,
    'ruleset-name': 'GEOSITE-CN',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct')
  },
  {
    id: sampleID(),
    type: 'rule_set_url',
    payload:
      'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite/geolocation-!cn.srs',
    server: 'remote-dns',
    'disable-cache': false,
    invert: false,
    'ruleset-name': 'GEOLOCATION-!CN',
    'ruleset-format': 'binary',
    'download-detour': t('outbound.direct')
  }
]

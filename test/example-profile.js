/**
 * export defaults one object that is an example profile, in the 'raw' format,
 * i.e. the format that nsIProfiler.getProfileDataAsync outputs.
 */

const parentProcessBinary = {
  breakpadId: 'F1D957D30B413D55A539BBA06F90DD8F0',
  name: '/Applications/FirefoxNightly.app/Contents/MacOS/firefox',
  start: 0x100000000,
  end: 0x100000000 + 10000
};

const contentProcessBinary = {
  breakpadId: '9F950E2CE3CD3E1ABD06D80788B606E60',
  name: '/Applications/FirefoxNightly.app/Contents/MacOS/firefox-webcontent.app/Contents/MacOS/firefox-webcontent',
  start: 0x100000000,
  end: 0x100000000 + 10000
};

const extraBinaries = [ // intentionally wrong sort order, preprocessProfile will sort them
  {
    pdbName: 'examplebinary2.pdb',
    pdbSignature: '{10000000-0000-0000-0000-0000000000a2}',
    pdbAge: 7,
    name: 'C:\\examplebinary2',
    start: 0x200000000 + 20,
    end: 0x200000000 + 40
  },
  {
    breakpadId: '1000000000000000000000000000000A1',
    name: '/tmp/examplebinary',
    start: 0x200000000,
    end: 0x200000000 + 20
  },
];

const thread = {
  samples: {
    schema: { stack: 0, time: 1, responsiveness: 2, rss: 3, uss: 4, frameNumber: 5, power: 6 },
    data: [
      [1, 0, 0], // (root), 0x100000f84
      [2, 1, 0], // (root), 0x100000f84, 0x100001a45
      [2, 2, 0], // (root), 0x100000f84, 0x100001a45
      [3, 3, 0], // (root), 0x100000f84, Startup::XRE_Main
      [0, 4, 0], // (root)
      [1, 5, 0], // (root), 0x100000f84
    ]
  },
  stackTable: {
    schema: { prefix: 0, frame: 1 },
    data: [
      [null, 0], // (root)
      [0, 1],    // (root), 0x100000f84
      [1, 2],    // (root), 0x100000f84, 0x100001a45
      [1, 3],    // (root), 0x100000f84, Startup::XRE_Main
    ],
  },
  frameTable: {
    schema: { location: 0, implementation: 1, optimizations: 2, line: 3, category: 4 },
    data: [
      [0],                       // (root)
      [1],                       // 0x100000f84
      [2],                       // 0x100001a45
      [3, null, null, 4391, 16], // Startup::XRE_Main, line 4391, category 16
    ]
  },
  markers: {
    schema: { name: 0, time: 1, data: 2 },
    data: [
      [4, 0, { category: 'VsyncTimestamp', vsync: 0 }],
      [5, 2, {
        category: 'Paint',
        interval: 'start',
        stack: {
          markers: { schema: { name: 0, time: 1, data: 2 }, data: [] },
          name: 'SyncProfile',
          samples: {
            schema: { stack: 0, time: 1, responsiveness: 2, rss: 3, uss: 4, frameNumber: 5, power: 6 },
            data: [[2, 1]] // (root), 0x100000f84, 0x100001a45
          }
        },
        type: 'tracing'
      }],
      [5, 4, {
        category: 'Paint',
        interval: 'end',
        type: 'tracing'
      }],
    ]
  },
  stringTable: [
    '(root)',
    '0x100000f84',
    '0x100001a45',
    'Startup::XRE_Main',
    'VsyncTimestamp',
    'Reflow',
  ],
};

const parentProcessMeta = {
  abi: 'x86_64-gcc3',
  interval: 1,
  misc: 'rv:48.0',
  oscpu: 'Intel Mac OS X 10.11',
  platform: 'Macintosh',
  processType: 0,
  product: 'Firefox',
  stackwalk: 1,
  startTime: 1460221352723.438,
  toolkit: 'cocoa',
  version: 3,
};

const contentProcessMeta = Object.assign({}, parentProcessMeta, {
  processType: 2,
  startTime: parentProcessMeta.startTime + 1000 // content process was launched 1 second after parent process
});

const contentProcessProfile = {
  meta: contentProcessMeta,
  libs: JSON.stringify([contentProcessBinary].concat(extraBinaries)), // libs are stringified in the profile
  threads: [
    Object.assign({ name: 'Content' }, thread)
  ]
};

const profile = {
  meta: parentProcessMeta,
  libs: JSON.stringify([parentProcessBinary].concat(extraBinaries)),
  threads: [
    Object.assign({ name: 'GeckoMain'}, thread),
    Object.assign({ name: 'Compositor'}, thread),
    JSON.stringify(contentProcessProfile) // subprocesses are stringified, too
  ]
};

export default profile;
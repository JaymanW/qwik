/**
 * @license
 * Copyright a-Qoot All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/a-Qoot/qoot/blob/main/LICENSE
 */

/// <reference types="./html" />

import { expect } from 'chai';
import { createGlobal, QootGlobal } from '../../testing/node_utils.js';
import { jsxDeclareComponent, jsxFactory } from './factory.js';
import { jsxRender } from './render.js';

const _needed_by_JSX_ = jsxFactory;

describe('render', () => {
  let global: QootGlobal;
  let document: Document;
  let host: HTMLElement;
  beforeEach(() => {
    global = createGlobal();
    host = global.document.createElement('host');
    document = global.document;
  });

  it('should render basic DOM structure', () => {
    jsxRender(host, <div id="abc">test</div>, undefined, global.document);
    expect(host.innerHTML).to.equal('<div id="abc">test</div>');
  });

  it('should not destroy existing DOM', () => {
    jsxRender(host, <div id="foo">original</div>, undefined, global.document);
    const originalDiv = host.firstChild;
    jsxRender(host, <div class="bar">overwrite</div>, undefined, global.document);
    expect(host.firstChild).to.equal(originalDiv, 'node identity should not be destroyed');
    expect(host.innerHTML).to.equal('<div id="foo" class="bar">overwrite</div>');
  });

  it('should remove extra text', () => {
    jsxRender(host, <div>original</div>, undefined, global.document);
    jsxRender(
      host,
      <div>
        {'a'}
        {'b'}
      </div>,
      undefined,
      global.document
    );
    expect(host.innerHTML).to.equal('<div>ab</div>');
    jsxRender(host, <div>original</div>, undefined, global.document);
    expect(host.innerHTML).to.equal('<div>original</div>');
  });

  it('should remove extra nodes', () => {
    jsxRender(
      host,
      <div>
        <span></span>
        <span></span>
      </div>,
      undefined,
      global.document
    );
    jsxRender(host, <div></div>, undefined, global.document);
    expect(host.innerHTML).to.equal('<div></div>');
    jsxRender(
      host,
      <div>
        <span></span>
        <span></span>
      </div>,
      undefined,
      global.document
    );
    expect(host.innerHTML).to.equal('<div><span></span><span></span></div>');
  });

  it('should render HEAD', () => {
    const head = document.querySelector('head')!;
    jsxRender(
      head,
      <head>
        <title>Hello World from Server</title>
        <script src="/qootloader.js" async></script>
      </head>,
      null,
      document
    );

    expect(head.outerHTML).to.equal(
      '<head>' +
        '<head>' +
        '<title>Hello World from Server</title>' +
        '<script src="/qootloader.js" async="true"></script>' +
        '</head>' +
        '</head>'
    );
  });

  it('should render HTML on document', () => {
    const doc = (
      <html>
        <head>
          <title>Hello World from Server</title>
          <script src="/qootloader.js" async></script>
        </head>
        <body>Hello World!</body>
      </html>
    );
    jsxRender(document, doc, null, document);

    const html = document.querySelector('html')!;
    console.log(html.outerHTML);
    expect(html.outerHTML).to.equal(
      '<html>' +
        '<head>' +
        '<title>Hello World from Server</title>' +
        '<script src="/qootloader.js" async="true"></script>' +
        '</head>' +
        '<body>Hello World!</body>' +
        '</html>'
    );
  });

  describe('components', () => {
    it('should render components', () => {
      const registry = {
        './HelloWorld_render': (props: { url?: string }) => <span>Hello World! ({props.url})</span>,
      };
      jsxRender(
        host,
        <div>
          <hello-world url="/" $={{ '::': './HelloWorld_render' }} />
        </div>,
        registry,
        global.document
      );
      expect(host.innerHTML).to.equal(
        '<div>' +
          '<hello-world url="/" ::="./HelloWorld_render">' +
          '<span>Hello World! (/)</span>' +
          '</hello-world>' +
          '</div>'
      );
    });
  });

  it('should render components as symbols', () => {
    const HelloWorld = jsxDeclareComponent<{ url: string }>('hello-world', './HelloWorld_render');
    const registry = {
      './HelloWorld_render': (props: { url?: string }) => <span>Hello World! ({props.url})</span>,
    };
    jsxRender(
      host,
      <div>
        <HelloWorld url="/" />
      </div>,
      registry,
      global.document
    );
    expect(host.innerHTML).to.equal(
      '<div>' +
        '<hello-world url="/" ::="./HelloWorld_render">' +
        '<span>Hello World! (/)</span>' +
        '</hello-world>' +
        '</div>'
    );

    it.skip('should render component from URL', () => {
      jsxRender(
        host,
        <div>
          <TestComponent />
        </div>,
        registry,
        global.document
      );
      expect(host.innerHTML).to.equal(
        '<div>' +
          '<hello-world url="/" ::="./HelloWorld_render">' +
          '<span>Hello World! (/)</span>' +
          '</hello-world>' +
          '</div>'
      );
    });
  });

  describe('qoot properties', () => {
    it('should render event', async () => {
      // possible prefixes: on, in, at, for, to, bind, tie
      // Event prefixes `.` to mean framework event such as `
      const registry = {
        './noopUrl': () => <>NOOP</>,
      };
      await jsxRender(
        host,
        <div
          $={{
            '::': './noopUrl',
            'bind:.': 'myUrl',
            'on:.render': 'myComponentUrl',
            'on:click': 'myComponent_click',
            'bind:token': 'myTokenUrl',
          }}
        ></div>,
        registry,
        global.document
      );
      expect(host.innerHTML).to.equal(
        '<div ::="./noopUrl" bind:.="myUrl" on:.render="myComponentUrl" on:click="myComponent_click" bind:token="myTokenUrl">NOOP</div>'
      );
    });
  });
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hello-world': { url?: string; $: any };
    }
  }
}

function TestComponent(props: {}) {
  return <div>TestComponent: props={JSON.stringify(props)}</div>;
}

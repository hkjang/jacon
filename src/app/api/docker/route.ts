import { NextRequest, NextResponse } from 'next/server';
import { getDockerApi } from '@/lib/docker-api';
import { db } from '@/lib/db';

// Docker API 프록시 - 엔드포인트별로 Docker API 호출
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');

  try {
    // 엔드포인트 정보 조회
    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const dockerUrl = endpoint?.url || process.env.DOCKER_HOST;
    const docker = getDockerApi(dockerUrl);

    switch (action) {
      case 'info':
        const info = await docker.getInfo();
        return NextResponse.json(info);

      case 'version':
        const version = await docker.getVersion();
        return NextResponse.json(version);

      case 'ping':
        const isAlive = await docker.ping();
        return NextResponse.json({ alive: isAlive });

      case 'containers':
        const all = searchParams.get('all') === 'true';
        const containers = await docker.listContainers(all);
        return NextResponse.json(containers);

      case 'container':
        const containerId = searchParams.get('id');
        if (!containerId) {
          return NextResponse.json({ error: 'Container ID required' }, { status: 400 });
        }
        const container = await docker.getContainer(containerId);
        return NextResponse.json(container);

      case 'images':
        const images = await docker.listImages();
        return NextResponse.json(images);

      case 'volumes':
        const volumes = await docker.listVolumes();
        return NextResponse.json(volumes);

      case 'networks':
        const networks = await docker.listNetworks();
        return NextResponse.json(networks);

      case 'stacks':
        const stacks = await docker.listStacks();
        return NextResponse.json(stacks);

      case 'services':
        const services = await docker.listServices();
        return NextResponse.json(services);

      case 'logs':
        const logContainerId = searchParams.get('id');
        if (!logContainerId) {
          return NextResponse.json({ error: 'Container ID required' }, { status: 400 });
        }
        const tail = parseInt(searchParams.get('tail') || '100');
        const logs = await docker.getContainerLogs(logContainerId, { tail });
        return NextResponse.json({ logs });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Docker API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');

  try {
    const body = await request.json().catch(() => ({}));

    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const dockerUrl = endpoint?.url || process.env.DOCKER_HOST;
    const docker = getDockerApi(dockerUrl);

    switch (action) {
      case 'container/create':
        const created = await docker.createContainer(body);
        db.addAuditLog('API', 'Create', `Container/${body.name}`, 'Docker container created', 'Info');
        return NextResponse.json(created);

      case 'container/start':
        await docker.startContainer(body.id);
        db.addAuditLog('API', 'Start', `Container/${body.id}`, 'Docker container started', 'Info');
        return NextResponse.json({ success: true });

      case 'container/stop':
        await docker.stopContainer(body.id, body.timeout);
        db.addAuditLog('API', 'Stop', `Container/${body.id}`, 'Docker container stopped', 'Info');
        return NextResponse.json({ success: true });

      case 'container/restart':
        await docker.restartContainer(body.id, body.timeout);
        db.addAuditLog('API', 'Restart', `Container/${body.id}`, 'Docker container restarted', 'Info');
        return NextResponse.json({ success: true });

      case 'container/kill':
        await docker.killContainer(body.id, body.signal);
        db.addAuditLog('API', 'Kill', `Container/${body.id}`, 'Docker container killed', 'Warning');
        return NextResponse.json({ success: true });

      case 'container/pause':
        await docker.pauseContainer(body.id);
        return NextResponse.json({ success: true });

      case 'container/unpause':
        await docker.unpauseContainer(body.id);
        return NextResponse.json({ success: true });

      case 'container/exec':
        const execResult = await docker.execInContainer(body.id, body.options);
        return NextResponse.json(execResult);

      case 'image/pull':
        await docker.pullImage(body.image, body.tag);
        db.addAuditLog('API', 'Pull', `Image/${body.image}:${body.tag}`, 'Docker image pulled', 'Info');
        return NextResponse.json({ success: true });

      case 'image/tag':
        await docker.tagImage(body.id, body.repo, body.tag);
        return NextResponse.json({ success: true });

      case 'volume/create':
        const volume = await docker.createVolume(body);
        return NextResponse.json(volume);

      case 'network/create':
        const network = await docker.createNetwork(body);
        return NextResponse.json(network);

      case 'network/connect':
        await docker.connectContainerToNetwork(body.networkId, body.containerId);
        return NextResponse.json({ success: true });

      case 'network/disconnect':
        await docker.disconnectContainerFromNetwork(body.networkId, body.containerId, body.force);
        return NextResponse.json({ success: true });

      case 'service/create':
        const service = await docker.createService(body.spec);
        return NextResponse.json(service);

      case 'service/scale':
        await docker.scaleService(body.id, body.replicas);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Docker API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const dockerUrl = endpoint?.url || process.env.DOCKER_HOST;
    const docker = getDockerApi(dockerUrl);
    const force = searchParams.get('force') === 'true';

    switch (action) {
      case 'container':
        await docker.removeContainer(id, force, searchParams.get('removeVolumes') === 'true');
        db.addAuditLog('API', 'Delete', `Container/${id}`, 'Docker container removed', 'Warning');
        return NextResponse.json({ success: true });

      case 'image':
        await docker.removeImage(id, force);
        db.addAuditLog('API', 'Delete', `Image/${id}`, 'Docker image removed', 'Warning');
        return NextResponse.json({ success: true });

      case 'volume':
        await docker.removeVolume(id, force);
        db.addAuditLog('API', 'Delete', `Volume/${id}`, 'Docker volume removed', 'Warning');
        return NextResponse.json({ success: true });

      case 'network':
        await docker.removeNetwork(id);
        db.addAuditLog('API', 'Delete', `Network/${id}`, 'Docker network removed', 'Warning');
        return NextResponse.json({ success: true });

      case 'service':
        await docker.removeService(id);
        db.addAuditLog('API', 'Delete', `Service/${id}`, 'Docker service removed', 'Warning');
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Docker API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

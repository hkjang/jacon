import { NextRequest, NextResponse } from 'next/server';
import { getKubernetesApi } from '@/lib/kubernetes-api';
import { db } from '@/lib/db';

// Kubernetes API 프록시 - 엔드포인트별로 K8s API 호출
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');
  const namespace = searchParams.get('namespace') || undefined;

  try {
    // 엔드포인트 정보 조회
    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const k8sUrl = endpoint?.url || process.env.KUBERNETES_API_URL;
    const k8s = getKubernetesApi(k8sUrl);

    switch (action) {
      case 'cluster-info':
        const clusterInfo = await k8s.getClusterInfo();
        return NextResponse.json(clusterInfo);

      case 'version':
        const version = await k8s.getServerVersion();
        return NextResponse.json(version);

      case 'health':
        const isHealthy = await k8s.healthCheck();
        return NextResponse.json({ healthy: isHealthy });

      case 'namespaces':
        const namespaces = await k8s.listNamespaces();
        return NextResponse.json(namespaces);

      case 'namespace':
        const nsName = searchParams.get('name');
        if (!nsName) {
          return NextResponse.json({ error: 'Namespace name required' }, { status: 400 });
        }
        const ns = await k8s.getNamespace(nsName);
        return NextResponse.json(ns);

      case 'pods':
        const pods = await k8s.listPods(namespace);
        return NextResponse.json(pods);

      case 'pod':
        const podName = searchParams.get('name');
        if (!podName) {
          return NextResponse.json({ error: 'Pod name required' }, { status: 400 });
        }
        const pod = await k8s.getPod(podName, namespace || 'default');
        return NextResponse.json(pod);

      case 'pod/logs':
        const logPodName = searchParams.get('name');
        if (!logPodName) {
          return NextResponse.json({ error: 'Pod name required' }, { status: 400 });
        }
        const container = searchParams.get('container') || undefined;
        const tailLines = parseInt(searchParams.get('tailLines') || '100');
        const logs = await k8s.getPodLogs(logPodName, namespace || 'default', { container, tailLines });
        return NextResponse.json({ logs });

      case 'deployments':
        const deployments = await k8s.listDeployments(namespace);
        return NextResponse.json(deployments);

      case 'deployment':
        const depName = searchParams.get('name');
        if (!depName) {
          return NextResponse.json({ error: 'Deployment name required' }, { status: 400 });
        }
        const deployment = await k8s.getDeployment(depName, namespace || 'default');
        return NextResponse.json(deployment);

      case 'statefulsets':
        const statefulsets = await k8s.listStatefulSets(namespace);
        return NextResponse.json(statefulsets);

      case 'statefulset':
        const stsName = searchParams.get('name');
        if (!stsName) {
          return NextResponse.json({ error: 'StatefulSet name required' }, { status: 400 });
        }
        const sts = await k8s.getStatefulSet(stsName, namespace || 'default');
        return NextResponse.json(sts);

      case 'daemonsets':
        const daemonsets = await k8s.listDaemonSets(namespace);
        return NextResponse.json(daemonsets);

      case 'jobs':
        const jobs = await k8s.listJobs(namespace);
        return NextResponse.json(jobs);

      case 'cronjobs':
        const cronjobs = await k8s.listCronJobs(namespace);
        return NextResponse.json(cronjobs);

      case 'services':
        const services = await k8s.listServices(namespace);
        return NextResponse.json(services);

      case 'service':
        const svcName = searchParams.get('name');
        if (!svcName) {
          return NextResponse.json({ error: 'Service name required' }, { status: 400 });
        }
        const svc = await k8s.getService(svcName, namespace || 'default');
        return NextResponse.json(svc);

      case 'configmaps':
        const configmaps = await k8s.listConfigMaps(namespace);
        return NextResponse.json(configmaps);

      case 'configmap':
        const cmName = searchParams.get('name');
        if (!cmName) {
          return NextResponse.json({ error: 'ConfigMap name required' }, { status: 400 });
        }
        const cm = await k8s.getConfigMap(cmName, namespace || 'default');
        return NextResponse.json(cm);

      case 'secrets':
        const secrets = await k8s.listSecrets(namespace);
        return NextResponse.json(secrets);

      case 'secret':
        const secretName = searchParams.get('name');
        if (!secretName) {
          return NextResponse.json({ error: 'Secret name required' }, { status: 400 });
        }
        const secret = await k8s.getSecret(secretName, namespace || 'default');
        return NextResponse.json(secret);

      case 'pvcs':
        const pvcs = await k8s.listPVCs(namespace);
        return NextResponse.json(pvcs);

      case 'ingresses':
        const ingresses = await k8s.listIngresses(namespace);
        return NextResponse.json(ingresses);

      case 'nodes':
        const nodes = await k8s.listNodes();
        return NextResponse.json(nodes);

      case 'node':
        const nodeName = searchParams.get('name');
        if (!nodeName) {
          return NextResponse.json({ error: 'Node name required' }, { status: 400 });
        }
        const node = await k8s.getNode(nodeName);
        return NextResponse.json(node);

      case 'events':
        const events = await k8s.listEvents(namespace);
        return NextResponse.json(events);

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Kubernetes API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');
  const namespace = searchParams.get('namespace') || 'default';

  try {
    const body = await request.json().catch(() => ({}));

    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const k8sUrl = endpoint?.url || process.env.KUBERNETES_API_URL;
    const k8s = getKubernetesApi(k8sUrl);

    switch (action) {
      case 'namespace/create':
        const ns = await k8s.createNamespace(body.name, body.labels);
        db.addAuditLog('API', 'Create', `Namespace/${body.name}`, 'Kubernetes namespace created', 'Info');
        return NextResponse.json(ns);

      case 'pod/create':
        const pod = await k8s.createPod(body, namespace);
        db.addAuditLog('API', 'Create', `Pod/${body.metadata?.name}`, 'Kubernetes pod created', 'Info');
        return NextResponse.json(pod);

      case 'deployment/create':
        const deployment = await k8s.createDeployment(body, namespace);
        db.addAuditLog('API', 'Create', `Deployment/${body.metadata?.name}`, 'Kubernetes deployment created', 'Info');
        return NextResponse.json(deployment);

      case 'deployment/update':
        const updatedDep = await k8s.updateDeployment(body.metadata.name, body, namespace);
        db.addAuditLog('API', 'Update', `Deployment/${body.metadata?.name}`, 'Kubernetes deployment updated', 'Info');
        return NextResponse.json(updatedDep);

      case 'deployment/scale':
        const scaledDep = await k8s.scaleDeployment(body.name, body.replicas, namespace);
        db.addAuditLog('API', 'Scale', `Deployment/${body.name}`, `Scaled to ${body.replicas} replicas`, 'Info');
        return NextResponse.json(scaledDep);

      case 'deployment/restart':
        const restartedDep = await k8s.restartDeployment(body.name, namespace);
        db.addAuditLog('API', 'Restart', `Deployment/${body.name}`, 'Kubernetes deployment restarted', 'Info');
        return NextResponse.json(restartedDep);

      case 'statefulset/create':
        const sts = await k8s.createStatefulSet(body, namespace);
        db.addAuditLog('API', 'Create', `StatefulSet/${body.metadata?.name}`, 'Kubernetes statefulset created', 'Info');
        return NextResponse.json(sts);

      case 'statefulset/scale':
        const scaledSts = await k8s.scaleStatefulSet(body.name, body.replicas, namespace);
        return NextResponse.json(scaledSts);

      case 'daemonset/create':
        const ds = await k8s.createDaemonSet(body, namespace);
        db.addAuditLog('API', 'Create', `DaemonSet/${body.metadata?.name}`, 'Kubernetes daemonset created', 'Info');
        return NextResponse.json(ds);

      case 'job/create':
        const job = await k8s.createJob(body, namespace);
        db.addAuditLog('API', 'Create', `Job/${body.metadata?.name}`, 'Kubernetes job created', 'Info');
        return NextResponse.json(job);

      case 'cronjob/create':
        const cronJob = await k8s.createCronJob(body, namespace);
        db.addAuditLog('API', 'Create', `CronJob/${body.metadata?.name}`, 'Kubernetes cronjob created', 'Info');
        return NextResponse.json(cronJob);

      case 'cronjob/suspend':
        const suspendedCj = await k8s.suspendCronJob(body.name, body.suspend, namespace);
        return NextResponse.json(suspendedCj);

      case 'service/create':
        const service = await k8s.createService(body, namespace);
        db.addAuditLog('API', 'Create', `Service/${body.metadata?.name}`, 'Kubernetes service created', 'Info');
        return NextResponse.json(service);

      case 'configmap/create':
        const configmap = await k8s.createConfigMap(body, namespace);
        db.addAuditLog('API', 'Create', `ConfigMap/${body.metadata?.name}`, 'Kubernetes configmap created', 'Info');
        return NextResponse.json(configmap);

      case 'configmap/update':
        const updatedCm = await k8s.updateConfigMap(body.metadata.name, body, namespace);
        db.addAuditLog('API', 'Update', `ConfigMap/${body.metadata?.name}`, 'Kubernetes configmap updated', 'Info');
        return NextResponse.json(updatedCm);

      case 'secret/create':
        const secret = await k8s.createSecret(body, namespace);
        db.addAuditLog('API', 'Create', `Secret/${body.metadata?.name}`, 'Kubernetes secret created', 'Warning');
        return NextResponse.json(secret);

      case 'secret/update':
        const updatedSecret = await k8s.updateSecret(body.metadata.name, body, namespace);
        db.addAuditLog('API', 'Update', `Secret/${body.metadata?.name}`, 'Kubernetes secret updated', 'Warning');
        return NextResponse.json(updatedSecret);

      case 'pvc/create':
        const pvc = await k8s.createPVC(body, namespace);
        db.addAuditLog('API', 'Create', `PVC/${body.metadata?.name}`, 'Kubernetes PVC created', 'Info');
        return NextResponse.json(pvc);

      case 'ingress/create':
        const ingress = await k8s.createIngress(body, namespace);
        db.addAuditLog('API', 'Create', `Ingress/${body.metadata?.name}`, 'Kubernetes ingress created', 'Info');
        return NextResponse.json(ingress);

      case 'node/cordon':
        const cordonedNode = await k8s.cordonNode(body.name);
        db.addAuditLog('API', 'Cordon', `Node/${body.name}`, 'Kubernetes node cordoned', 'Warning');
        return NextResponse.json(cordonedNode);

      case 'node/uncordon':
        const uncordonedNode = await k8s.uncordonNode(body.name);
        db.addAuditLog('API', 'Uncordon', `Node/${body.name}`, 'Kubernetes node uncordoned', 'Info');
        return NextResponse.json(uncordonedNode);

      case 'apply':
        const result = await k8s.applyYaml(body.yaml, namespace);
        db.addAuditLog('API', 'Apply', 'YAML', 'Kubernetes manifest applied', 'Info');
        return NextResponse.json(result);

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Kubernetes API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpointId = searchParams.get('endpointId');
  const action = searchParams.get('action');
  const name = searchParams.get('name');
  const namespace = searchParams.get('namespace') || 'default';

  if (!name) {
    return NextResponse.json({ error: 'Resource name required' }, { status: 400 });
  }

  try {
    const endpoint = endpointId
      ? db.getEndpoints().find(e => e.id === endpointId)
      : null;

    const k8sUrl = endpoint?.url || process.env.KUBERNETES_API_URL;
    const k8s = getKubernetesApi(k8sUrl);

    switch (action) {
      case 'namespace':
        await k8s.deleteNamespace(name);
        db.addAuditLog('API', 'Delete', `Namespace/${name}`, 'Kubernetes namespace deleted', 'High');
        return NextResponse.json({ success: true });

      case 'pod':
        await k8s.deletePod(name, namespace);
        db.addAuditLog('API', 'Delete', `Pod/${name}`, 'Kubernetes pod deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'deployment':
        await k8s.deleteDeployment(name, namespace);
        db.addAuditLog('API', 'Delete', `Deployment/${name}`, 'Kubernetes deployment deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'statefulset':
        await k8s.deleteStatefulSet(name, namespace);
        db.addAuditLog('API', 'Delete', `StatefulSet/${name}`, 'Kubernetes statefulset deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'daemonset':
        await k8s.deleteDaemonSet(name, namespace);
        db.addAuditLog('API', 'Delete', `DaemonSet/${name}`, 'Kubernetes daemonset deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'job':
        await k8s.deleteJob(name, namespace);
        db.addAuditLog('API', 'Delete', `Job/${name}`, 'Kubernetes job deleted', 'Info');
        return NextResponse.json({ success: true });

      case 'cronjob':
        await k8s.deleteCronJob(name, namespace);
        db.addAuditLog('API', 'Delete', `CronJob/${name}`, 'Kubernetes cronjob deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'service':
        await k8s.deleteService(name, namespace);
        db.addAuditLog('API', 'Delete', `Service/${name}`, 'Kubernetes service deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'configmap':
        await k8s.deleteConfigMap(name, namespace);
        db.addAuditLog('API', 'Delete', `ConfigMap/${name}`, 'Kubernetes configmap deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'secret':
        await k8s.deleteSecret(name, namespace);
        db.addAuditLog('API', 'Delete', `Secret/${name}`, 'Kubernetes secret deleted', 'High');
        return NextResponse.json({ success: true });

      case 'pvc':
        await k8s.deletePVC(name, namespace);
        db.addAuditLog('API', 'Delete', `PVC/${name}`, 'Kubernetes PVC deleted', 'Warning');
        return NextResponse.json({ success: true });

      case 'ingress':
        await k8s.deleteIngress(name, namespace);
        db.addAuditLog('API', 'Delete', `Ingress/${name}`, 'Kubernetes ingress deleted', 'Warning');
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Kubernetes API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

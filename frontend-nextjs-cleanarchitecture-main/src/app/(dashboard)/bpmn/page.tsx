'use client';

import { useEffect, useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Node,
    Edge,
    ConnectionLineType,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

import { analyticsApi } from '@/core/api/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { useTranslations } from '@/core/hooks';

// Dagre Layout Helper
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

export default function BPMNDataPage() {
    const { t } = useTranslations();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await analyticsApi.getBPMNData();

                // Transform to React Flow format
                const initialNodes: Node[] = result.nodes.map((n) => ({
                    id: n.id,
                    data: { label: n.label },
                    position: { x: 0, y: 0 }, // Layout will handle this
                    style: {
                        background: '#fff',
                        border: '1px solid #777',
                        borderRadius: '4px',
                        padding: '10px',
                        fontSize: '12px',
                        width: 170,
                        textAlign: 'center'
                    },
                }));

                const initialEdges: Edge[] = result.edges.map((e, i) => ({
                    id: `e${i}`,
                    source: e.source,
                    target: e.target,
                    type: 'smoothstep',
                    animated: true,
                    label: e.label || '',
                    style: { stroke: '#555' },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 20,
                        height: 20,
                        color: '#555',
                    },
                }));

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    initialNodes,
                    initialEdges
                );

                setNodes(layoutedNodes);
                setEdges(layoutedEdges);

            } catch (error) {
                console.error('Failed to fetch BPMN data', error);
            }
        };

        fetchData();
    }, [setNodes, setEdges]);

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('bpmn.title')}</h2>
                <p className="text-muted-foreground">
                    {t('bpmn.description')}
                </p>
            </div>

            <Card className="flex-1">
                <CardHeader className="py-4">
                    <CardTitle>{t('bpmn.visualization') || 'Process Visualization'}</CardTitle>
                    <CardDescription>
                        {nodes.length} {t('bpmn.nodes')}, {edges.length} {t('bpmn.edges')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] p-0 border-t">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        attributionPosition="bottom-right"
                    >
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </CardContent>
            </Card>
        </div>
    );
}

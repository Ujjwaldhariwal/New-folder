import { OrbitControls } from '@react-three/drei';
import BarChart3D from '../Charts/BarChart3D';
import PieChart3D from '../Charts/PieChart3D';

function CompactScene({ data, chartType, barLabelStyle }) {
  const renderChart = () => {
    if (!data || !data.length) return null;

    switch (chartType) {
      case 'pie':
        return (
          <group
            rotation={[-Math.PI / 2, 0, 0]} 
            scale={[.85, .85, .85]}
            position={[0, -0.1, 0]}
          >
            <PieChart3D data={data} labelStyle="compact" />
          </group>
        );

      case 'bar':
      default:
        return (
          <group scale={[1.4, 1.4, 1.4]} position={[0, -0.1, 0]}>
            <BarChart3D data={data} labelStyle={barLabelStyle} />
          </group>
        );
    }
  };

  return (
    <>
      {/* Clean lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />

      {renderChart()}

      {/* Same restricted controls for both pie and bar charts in compact mode */}
      <OrbitControls
        enableRotate={false}     // ✅ No rotation for compact view
        enableZoom={false}       // ✅ No zoom for compact view
        enablePan={false}        // ✅ No pan for compact view
        target={[0, 0, 0]}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI}
        maxAzimuthAngle={Math.PI}
      />
    </>
  );
}

export default CompactScene;
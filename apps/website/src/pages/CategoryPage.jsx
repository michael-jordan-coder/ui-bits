import { Suspense, lazy, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { componentMap } from '../constants/Components';
import { decodeLabel } from '../utils/utils';
import { useTransition } from '../hooks/useTransition';
import { GetStartedLoader, SkeletonLoader } from '../components/common/SkeletonLoader';
import BackToTopButton from '../components/common/BackToTopButton';
import IndexPage from './IndexPage';

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const { transitionPhase, getPreloadedComponent } = useTransition();

  const decodedLabel = subcategory ? decodeLabel(subcategory) : '';
  const isLoading = transitionPhase === 'loading';
  const opacity = ['fade-out', 'loading'].includes(transitionPhase) ? 0 : 1;
  const isGetStartedRoute = category === 'get-started';
  const isIndexPage = subcategory === 'index';

  const componentFactory = subcategory && componentMap[subcategory];
  const preloaded = getPreloadedComponent(subcategory);
  const SubcategoryComponent = preloaded?.default || (componentFactory ? lazy(componentFactory) : null);
  const Loader = isGetStartedRoute ? GetStartedLoader : SkeletonLoader;

  useEffect(() => {
    if (transitionPhase !== 'fade-out') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [subcategory, transitionPhase]);

  useEffect(() => {
    if (decodedLabel) {
      document.title = `ui bits — ${decodedLabel}`;
    }
  }, [decodedLabel]);

  if (isIndexPage) return <IndexPage />;

  return (
    <Box className={`category-page ${isLoading ? 'loading' : ''}`}>
      <Box className="page-transition-fade" style={{ opacity }}>
        {!isGetStartedRoute && <h2 className="sub-category">{decodedLabel}</h2>}

        {SubcategoryComponent ? (
          <Suspense fallback={<Loader />}>
            <SubcategoryComponent />
          </Suspense>
        ) : (
          <Box p={6}>
            <Text color="#fff" fontWeight={600} fontSize="18px">
              Not found
            </Text>
            <Text color="#a6a6a6" fontSize="14px">
              This section is unavailable.
            </Text>
          </Box>
        )}
      </Box>
      <BackToTopButton />
    </Box>
  );
};

export default CategoryPage;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create platforms first
  const platforms = [
    {
      name: '인스타그램',
      slug: 'instagram',
      icon: '📷',
      color: '#E4405F',
      description: '인스타그램 마케팅 서비스',
      sortOrder: 1,
    },
    {
      name: '유튜브',
      slug: 'youtube',
      icon: '🎥',
      color: '#FF0000',
      description: '유튜브 마케팅 서비스',
      sortOrder: 2,
    },
    {
      name: '페이스북',
      slug: 'facebook',
      icon: '📘',
      color: '#1877F2',
      description: '페이스북 마케팅 서비스',
      sortOrder: 3,
    },
    {
      name: '틱톡',
      slug: 'tiktok',
      icon: '🎵',
      color: '#000000',
      description: '틱톡 마케팅 서비스',
      sortOrder: 4,
    },
    {
      name: '트위터',
      slug: 'twitter',
      icon: '🐦',
      color: '#1DA1F2',
      description: '트위터 마케팅 서비스',
      sortOrder: 5,
    }
  ];

  const createdPlatforms = [];
  for (const platform of platforms) {
    const created = await prisma.platform.upsert({
      where: { slug: platform.slug },
      update: platform,
      create: platform,
    });
    createdPlatforms.push(created);
    console.log(`✅ Platform created: ${created.name}`);
  }

  // Create categories
  const categories = [
    {
      name: '좋아요',
      slug: 'likes',
      platformId: createdPlatforms[0].id, // Instagram
      icon: '❤️',
      description: '좋아요 서비스',
      sortOrder: 1,
    },
    {
      name: '팔로워',
      slug: 'followers',
      platformId: createdPlatforms[0].id, // Instagram
      icon: '👥',
      description: '팔로워 서비스',
      sortOrder: 2,
    },
    {
      name: '조회수',
      slug: 'views',
      platformId: createdPlatforms[1].id, // YouTube
      icon: '👁️',
      description: '조회수 서비스',
      sortOrder: 1,
    },
    {
      name: '구독자',
      slug: 'subscribers',
      platformId: createdPlatforms[1].id, // YouTube
      icon: '🔔',
      description: '구독자 서비스',
      sortOrder: 2,
    }
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: {
        platformId_slug: {
          platformId: category.platformId,
          slug: category.slug
        }
      },
      update: category,
      create: category,
    });
    createdCategories.push(created);
    console.log(`✅ Category created: ${created.name} for platform ${category.platformId}`);
  }

  // Create service slots for the requested services
  const serviceSlots = [
    {
      name: '추천서비스',
      slug: 'recommended-services',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '⭐',
      description: '인기 추천 서비스 모음',
      price: 5000,
      minQuantity: 1,
      maxQuantity: 1000,
      unit: '개',
      deliveryTime: '즉시-1시간',
      quality: 'premium',
      isPopular: true,
      isRecommended: true,
      sortOrder: 1,
      features: ['즉시 시작', '100% 안전', '24시간 지원', '리필 보장'],
    },
    {
      name: '이벤트',
      slug: 'events',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '🎁',
      description: '특별 이벤트 서비스',
      price: 3000,
      minQuantity: 1,
      maxQuantity: 500,
      unit: '개',
      deliveryTime: '1-6시간',
      quality: 'standard',
      isPopular: true,
      sortOrder: 2,
      features: ['이벤트 가격', '한정 수량', '빠른 처리'],
    },
    {
      name: '상위노출',
      slug: 'top-exposure',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '👑',
      description: '게시물 상위 노출 서비스',
      price: 15000,
      minQuantity: 1,
      maxQuantity: 100,
      unit: '회',
      deliveryTime: '12-24시간',
      quality: 'premium',
      isRecommended: true,
      sortOrder: 3,
      features: ['상위 노출', '알고리즘 최적화', '지속 효과'],
    },
    {
      name: '계정관리',
      slug: 'account-management',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[1].id,
      icon: '📊',
      description: '계정 관리 및 운영 서비스',
      price: 50000,
      minQuantity: 1,
      maxQuantity: 10,
      unit: '개월',
      deliveryTime: '즉시 시작',
      quality: 'premium',
      sortOrder: 4,
      features: ['전문 관리', '월간 리포트', '24/7 모니터링'],
    },
    {
      name: '패키지',
      slug: 'packages',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '📦',
      description: '올인원 패키지 서비스',
      price: 25000,
      minQuantity: 1,
      maxQuantity: 50,
      unit: '패키지',
      deliveryTime: '1-3일',
      quality: 'premium',
      isPopular: true,
      sortOrder: 5,
      features: ['통합 서비스', '할인 혜택', '맞춤 구성'],
    },
    {
      name: '인스타그램',
      slug: 'instagram-services',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '📷',
      description: '인스타그램 전용 서비스',
      price: 1000,
      minQuantity: 10,
      maxQuantity: 10000,
      unit: '개',
      deliveryTime: '1-24시간',
      quality: 'standard',
      sortOrder: 6,
      features: ['실제 계정', '한국인 우선', '자연스러운 증가'],
    },
    {
      name: '유튜브',
      slug: 'youtube-services',
      platformId: createdPlatforms[1].id,
      categoryId: createdCategories[2].id,
      icon: '🎥',
      description: '유튜브 전용 서비스',
      price: 500,
      minQuantity: 100,
      maxQuantity: 100000,
      unit: '회',
      deliveryTime: '1-48시간',
      quality: 'standard',
      sortOrder: 7,
      features: ['고급 조회수', '체류시간 보장', '지역별 타겟팅'],
    },
    {
      name: '페이스북',
      slug: 'facebook-services',
      platformId: createdPlatforms[2].id,
      categoryId: createdCategories[0].id,
      icon: '📘',
      description: '페이스북 전용 서비스',
      price: 800,
      minQuantity: 10,
      maxQuantity: 5000,
      unit: '개',
      deliveryTime: '2-24시간',
      quality: 'standard',
      sortOrder: 8,
      features: ['실제 프로필', '안전한 증가', '다양한 연령대'],
    },
    {
      name: '틱톡',
      slug: 'tiktok-services',
      platformId: createdPlatforms[3].id,
      categoryId: createdCategories[0].id,
      icon: '🎵',
      description: '틱톡 전용 서비스',
      price: 1200,
      minQuantity: 10,
      maxQuantity: 50000,
      unit: '개',
      deliveryTime: '1-12시간',
      quality: 'standard',
      sortOrder: 9,
      features: ['트렌드 반영', '빠른 바이럴', '젊은 층 타겟'],
    },
    {
      name: '스레드',
      slug: 'threads-services',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '🔗',
      description: '스레드 전용 서비스',
      price: 1500,
      minQuantity: 5,
      maxQuantity: 1000,
      unit: '개',
      deliveryTime: '2-12시간',
      quality: 'standard',
      sortOrder: 10,
      features: ['신규 플랫폼', '높은 참여율', '프리미엄 사용자'],
    },
    {
      name: '트위터',
      slug: 'twitter-services',
      platformId: createdPlatforms[4].id,
      categoryId: createdCategories[0].id,
      icon: '🐦',
      description: '트위터 전용 서비스',
      price: 1000,
      minQuantity: 10,
      maxQuantity: 10000,
      unit: '개',
      deliveryTime: '1-6시간',
      quality: 'standard',
      sortOrder: 11,
      features: ['실시간 반영', '글로벌 사용자', '빠른 확산'],
    },
    {
      name: 'Nz로블',
      slug: 'nz-roblox',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '📌',
      description: 'Nz로블 게임 관련 서비스',
      price: 2000,
      minQuantity: 1,
      maxQuantity: 1000,
      unit: '개',
      deliveryTime: '6-24시간',
      quality: 'standard',
      sortOrder: 12,
      features: ['게임 특화', '안전 보장', '커뮤니티 연동'],
    },
    {
      name: '뉴스언론보도',
      slug: 'news-media',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '📈',
      description: '뉴스 및 언론 보도 서비스',
      price: 100000,
      minQuantity: 1,
      maxQuantity: 10,
      unit: '건',
      deliveryTime: '3-7일',
      quality: 'premium',
      isRecommended: true,
      sortOrder: 13,
      features: ['언론사 보도', '신뢰도 높음', '장기적 효과', 'SEO 최적화'],
    },
    {
      name: '채널단',
      slug: 'channel-group',
      platformId: createdPlatforms[1].id,
      categoryId: createdCategories[2].id,
      icon: '🎬',
      description: '채널 단위 서비스',
      price: 30000,
      minQuantity: 1,
      maxQuantity: 20,
      unit: '채널',
      deliveryTime: '1-3일',
      quality: 'premium',
      sortOrder: 14,
      features: ['채널 전체 관리', '맞춤 전략', '성과 분석'],
    },
    {
      name: '카카오',
      slug: 'kakao-services',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '📺',
      description: '카카오 플랫폼 서비스',
      price: 2000,
      minQuantity: 10,
      maxQuantity: 5000,
      unit: '개',
      deliveryTime: '2-12시간',
      quality: 'standard',
      sortOrder: 15,
      features: ['국내 사용자', '높은 신뢰도', '안전한 서비스'],
    },
    {
      name: '스토어마케팅',
      slug: 'store-marketing',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '🎭',
      description: '온라인 스토어 마케팅',
      price: 20000,
      minQuantity: 1,
      maxQuantity: 100,
      unit: '프로젝트',
      deliveryTime: '3-7일',
      quality: 'premium',
      sortOrder: 16,
      features: ['매출 증대', '브랜드 인지도', '고객 유입'],
    },
    {
      name: '어플마케팅',
      slug: 'app-marketing',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '🎯',
      description: '모바일 앱 마케팅',
      price: 25000,
      minQuantity: 1,
      maxQuantity: 50,
      unit: '프로젝트',
      deliveryTime: '5-10일',
      quality: 'premium',
      sortOrder: 17,
      features: ['앱 다운로드 증가', '사용자 활성화', 'ASO 최적화'],
    },
    {
      name: 'SEO트래픽',
      slug: 'seo-traffic',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '⚙️',
      description: 'SEO 및 웹 트래픽 서비스',
      price: 15000,
      minQuantity: 1,
      maxQuantity: 200,
      unit: '키워드',
      deliveryTime: '7-30일',
      quality: 'premium',
      sortOrder: 18,
      features: ['검색 순위 상승', '자연 트래픽', '지속적 효과'],
    },
    {
      name: '기타',
      slug: 'others',
      platformId: createdPlatforms[0].id,
      categoryId: createdCategories[0].id,
      icon: '🔧',
      description: '기타 마케팅 서비스',
      price: 10000,
      minQuantity: 1,
      maxQuantity: 100,
      unit: '서비스',
      deliveryTime: '1-7일',
      quality: 'standard',
      sortOrder: 19,
      features: ['맞춤 서비스', '유연한 대응', '다양한 옵션'],
    },
  ];

  for (const serviceSlot of serviceSlots) {
    const created = await prisma.serviceSlot.upsert({
      where: {
        platformId_categoryId_slug: {
          platformId: serviceSlot.platformId,
          categoryId: serviceSlot.categoryId,
          slug: serviceSlot.slug
        }
      },
      update: serviceSlot,
      create: serviceSlot,
    });
    console.log(`✅ Service Slot created: ${created.name}`);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Platforms: ${platforms.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Service Slots: ${serviceSlots.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

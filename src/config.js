// Integrações: preencha os campos vazios para ativar cada uma.
export const CONFIG = {
  // POST JSON do formulário de contato (Formspree, HubSpot, LeadConnector webhook, API própria...).
  // Vazio: o lead é enviado pelo WhatsApp da unidade escolhida.
  formEndpoint: '',
  newsletterEndpoint: '',
  // GA4 só carrega depois do aceite de cookies.
  ga4Id: '',
  site: 'https://infisconsultoria.com.br',
  blog: 'https://infisconsultoria.com.br/blog-pt-br',
  social: {
    linkedin: 'https://www.linkedin.com/company/infisconsultoria/',
    instagram: 'https://www.instagram.com/infisconsultoria',
    youtube: 'https://www.youtube.com/@InfisConsultoria',
    facebook: 'https://www.facebook.com/infisconsultoria',
  },
  units: [
    {
      id: 'rj',
      city: 'Rio de Janeiro',
      address: 'Av. Rio Branco, 40, 16º andar, Centro',
      cityLine: 'Rio de Janeiro/RJ · CEP 20090-002',
      phone: '+552131696554',
      phoneLabel: '(21) 3169-6554',
      whatsapp: '5521984121863',
      whatsappLabel: '(21) 98412-1863',
      image: 'photo-1483729558449-99ef09a8c325',
    },
    {
      id: 'sp',
      city: 'São Paulo',
      address: 'Av. Nicolas Boer, 399, 3º andar, Torre Corporate',
      cityLine: 'São Paulo/SP · CEP 01140-060',
      phone: '',
      phoneLabel: '',
      whatsapp: '5521984121863',
      whatsappLabel: '(21) 98412-1863',
      image: 'photo-1543059080-f9b1272213d5',
    },
    {
      id: 'am',
      city: 'Manaus',
      address: 'Av. Efigênio, 1299, Aleixo',
      cityLine: 'Manaus/AM',
      mapQuery: 'Av. Efigênio Salles, 1299, Aleixo, Manaus, AM',
      email: 'umeireles@infisconsultoria.com.br',
      phone: '+5592982471616',
      phoneLabel: '(92) 98247-1616',
      whatsapp: '5592982471616',
      whatsappLabel: '(92) 98247-1616',
      image: 'photo-1565008447742-97f6f38c985c',
    },
  ],
};

export const img = (id, w = 1600, extra = '') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75${extra}`;

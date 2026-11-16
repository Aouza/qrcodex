import Link from "next/link";
import { notFound } from "next/navigation";
import { musicSlug } from "@/lib/music/protocol";
import { productionMusicEnabled } from "@/lib/music/runtime";
import { createPublicClient } from "@/lib/supabase/public";
import styles from "../music.module.css";
export const metadata={title:"Privacidade — Música",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function MusicPrivacy({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;if(!productionMusicEnabled()||!musicSlug.safeParse(slug).success)notFound();
  const {data:tenant,error}=await createPublicClient().from("establishments").select("name").eq("slug",slug).eq("active",true).maybeSingle();
  if(error)throw new Error("Music privacy temporarily unavailable.");
  if(!tenant)notFound();
  return <main className={`${styles.page} ${styles.policy}`}><Link href={`/${slug}/musicas`}>Voltar à Música</Link><h1>Privacidade e termos de Música</h1>
    <p>Versão: 30/09/2026. Este módulo utiliza os serviços da API do YouTube para buscar vídeos e reproduzi-los na TV do estabelecimento. Pedidos não garantem reprodução.</p>
    <p>Ao aceitar e usar Música, você concorda com esta política e com os <a href="https://www.youtube.com/t/terms">Termos de Serviço do YouTube</a>. Consulte também a <a href="https://policies.google.com/privacy">Política de Privacidade do Google</a>.</p>
    <p>Não exigimos conta de cliente nem login do YouTube. Um cookie HttpOnly, válido por até 30 dias, registra a aceitação desta versão e uma identificação aleatória para limitar tentativas e reconhecer pedidos repetidos. A TV tem uma autorização independente, revogável, de até 30 dias; ela não dá acesso ao admin.</p>
    <p>O servidor processa o endereço de rede informado pelo provedor confiável para gerar uma identificação criptográfica usada contra abuso. Não armazenamos o endereço original. Identificações de rede/tentativas são apagadas em até 24 horas com a rotina de limpeza operacional; registros de pedidos, metadados dos vídeos e recibos de tentativa são temporários, por até 30 dias.</p>
    <p>Usamos Supabase para guardar a fila e Vercel para hospedar a aplicação. O YouTube/Google recebe consultas de busca e identificadores dos vídeos. O player oficial pode apresentar anúncios, reconhecer cookies e coletar dados do dispositivo segundo as políticas do Google. Não removemos anúncios nem extraímos áudio dos vídeos.</p>
    <p>Não coletamos senhas do YouTube, não fazemos votação, não vendemos prioridade e não utilizamos esses registros para analytics ou recomendações. Você pode continuar acessando Cardápio e Agenda sem aceitar o módulo Música.</p>
    <p>Para dúvidas ou pedidos de exclusão, contate o estabelecimento pelos <Link href={`/${slug}`}>canais disponíveis no Hub</Link>. Apagar dados deste aplicativo não remove dados do YouTube; consulte os controles do Google. A disponibilidade do serviço depende do player e das APIs externas.</p>
  </main>;
}
